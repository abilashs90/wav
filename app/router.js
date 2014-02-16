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

})(this);