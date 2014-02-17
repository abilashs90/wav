(function(GLOBAL) {
  'use strict';

  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }
  });

  GLOBAL.app = GLOBAL.app || {};

  var params;

  _.extend(GLOBAL.app, (function() {

    function init() {
      Router.before(function() {
        params = this.params;
      });
    }

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

    function param(name) {
      return params[name];
    }

    function definePage(name, api) {
      // processing required by server
      var controllerName = _(name).capitalize()+'Controller';

      GLOBAL[controllerName] = RouteController.extend({
        data: api.data
      });


      // processing required by client
      if(!Meteor.isClient) return;

      var template = Template[name];
      if(!template) return;

      template.events(api.events);
      if(api.onPageRender && _.isFunction(api.onPageRender)) {
        template.rendered = api.onPageRender
      } 
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

      actionHandle.apply(this, args);
    }

    function cannotCallActionOnServer(action) {
      return 'Action \''+action+'\' can\'t be called on server';
    }

    var actions = {
      redirect: function(routeName) {
        if(!Meteor.isClient) throw cannotCallActionOnServer('redirect');

        return Router.go(routeName);
      },

      callServerMethod: function() {
        var args = _.toArray(arguments);
        return Meteor.call.apply(this, args);
      },

      loginUser: function(service, config, callback) {
        ({
          'facebook': function() {
            Meteor.loginWithFacebook(config, function(error) {
              try {
                // TODO: supporting ACS is wav specific. Need to find place for 
                //       application specific actions.
                var res = Meteor.call('loginOnAcsWithFacebook');
                console.log(res);
                callback.call(this, error);
              }
              catch(ex) {
                callback.call(this, ex);
              }
            });
          }
        })[service].call(this);
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

    Router.before(function() {
      var route =  {
        name: this.route.name,
        path: this.route.options.path,
        template: this.template
      }

      publish('beforePageRender', route);
    });

    init();

    return {
      routerConfig: routerConfig,
      routes: routes,
      param: param,
      definePage: definePage,
      action: action,
      on: subscribe,
      trigger: publish,
      url: createUrl
    };

  })());
  
})(this);