(function(GLOBAL) {

  app.routerConfig({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
  });

  app.routes([
    {name: 'home', path: '/'},
    {name: 'browse', path: '/b/?:path(*)'},
    {name: 'logout', path: '/logout'}
  ]);

  app.on('beforePageRender', function(route) {
    var allowedRoutes = [
      'home', 'logout'
    ];

    // If current route is found in allowed routes, then dont do anything
    if(_.indexOf(allowedRoutes, route.name) >= 0) return true;

    app.action('redirect', 'home')
  });

})(this);