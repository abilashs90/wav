(function(GLOBAL) {
  'use strict';
  return;

  function initIronRouter(config) {
    Router.configure(config.config);

    Router.map(function() {
      for(var i in config.routes) {
        var route = config.routes;
        this.route(route.name, {path: config.path});
      }
    });
  }

})(this);
