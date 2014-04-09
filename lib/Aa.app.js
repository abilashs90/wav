(function(GLOBAL) {
  'use strict';

  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }
  });

  GLOBAL.app = GLOBAL.app || {};

  _.extend(GLOBAL.app, (function() {

    function routerConfig(config) {
      Router.configure(config);
    }

    function routes(routes) {
      Router.map(function() {
        var self = this;

        for(var i in routes) {
          var route = routes[i];
          self.route(route.name, {path: route.path});
        }
      });
    }

    // creates url for given routeName
    function createUrl(routeName, params, query, hash) {
      var route = Router.routes[routeName];
      if(!route) return;

      return route.path(params, {
        query: query,
        hash: hash
      });
    }

    function action() {
      var args = _.toArray(arguments),
          actionName = args.shift(),
          actionHandle = actions[actionName];

      if(!actionHandle) throw 'There\'s no action "'+actionName+'" ';

      return actionHandle.apply(this, args);
    }

    function cannotCallActionOnServer(action) {
      return 'Action \''+action+'\' can\'t be called on server';
    }

    var actions = {
      redirect: function(routeName, params) {
        if(!Meteor.isClient) throw cannotCallActionOnServer('redirect');

        return Router.go(routeName, params);
      },

      getCurrentLocation: function() {
        if(!Meteor.isClient) throw cannotCallActionOnServer('getCurrentLocation');

        return window.location;
      },

      callServerMethod: function() {
        var args = _.toArray(arguments);
        return Meteor.call.apply(this, args);
      }
    }

    var eventMap = {}
    function subscribe(event, handler) {
      if(!_.isFunction(handler)) return;
      var context = this,
          handlers = eventMap[event] = eventMap[event] || [];
      handlers.push({
        context: context,
        func: handler
      });
    }

    function publish() {
      var args = _.toArray(arguments),
          event = args.shift(),
          handlers = eventMap[event];

      if(!handlers) return;

      for(var i=0; i < handlers.length; i++) {
        var handler = handlers[i];
        handler.func.apply(handler.context, args);
      }
    }

    Router.onBeforeAction(function() {
      var self = this,
      route =  {
        name: this.route.name,
        path: this.route.options.path,
        template: this.template
      },
      options = {
        stop: self.stop,
        render: self.render
      }

      publish('beforePageRender', route, options);
    });

    return {
      routerConfig: routerConfig,
      routes: routes,
      action: action,
      on: subscribe,
      trigger: publish,
      url: createUrl
    };

  })());

})(this);
