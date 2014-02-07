(function(GLOBAL) {
  'use strict';

  GLOBAL.app = GLOBAL.app || {};

  _.extend(GLOBAL.app, (function() {

    function routerConfig(config) {
      Router.configure(config);
    }

    function routes(routes) {
      Router.map(function() {
        for(var i in routes) {
          var route = routes[i];
          this.route(route.name, {path: route.path});
        }
      });
    }

    return {
      routerConfig: routerConfig,
      routes: routes
    };

  })());
  
})(this);