(function(GLOBAL) {

  app.routerConfig({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
  });

  app.routes([
    {name: 'home', path: '/'}
  ]);

})(this);
