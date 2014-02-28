(function(GLOBAL) {

  app.routerConfig({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
  });

  app.routes([
    {name: 'home', path: '/'},
    {name: 'browse', path: '/b/?:path(*)'},
    {name: 'login', path: '/login'},
    {name: 'logout', path: '/logout'}
  ]);

  app.on('beforePageRender', function(route, options) {
    var allowedRoutes = [
      'login', 'logout'
    ];

    // If current route is found in allowed routes, then dont do anything
    if(_.indexOf(allowedRoutes, route.name) >= 0) return true;

    if(app.action('callServerMethod', 'getUser', function(error, userId) {
      console.log(userId);
      if(userId) return;

      app.action('redirect', 'login', {ret: 'alskdjfalskdjf'});
    }));
  });

})(this);