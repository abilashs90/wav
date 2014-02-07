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

  var routerConfig;
  Meteor.ranAt = []

  if(Meteor.isServer) {
    Meteor.ranAt.push('server');

    routerConfig = JSON.parse(Assets.getText('routerConfig.json'));
    console.log(routerConfig);
  }
  else {
    Meteor.ranAt.push('client');
  }

  console.log(Meteor.ranAt);

})(this);