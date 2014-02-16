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
      redirect: function(url) {
        if(!Meteor.isClient) throw cannotCallActionOnServer('redirect');

        return window.location.href = url;
      },

      callServerMethod: function() {
        var args = _.toArray(arguments);

        //console.log('Calling server method ', method, ' with args ', args);   

        return Meteor.call.apply(this, args);
      }
    }

    init();

    return {
      routerConfig: routerConfig,
      routes: routes,
      param: param,
      definePage: definePage,
      action: action
    };

  })());
  
})(this);