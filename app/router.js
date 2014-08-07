(function(GLOBAL) {

  app.routerConfig({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
  });

  app.routes([
    {name: 'home', path: '/'},
    {name: 'product', path: '/product/:id'},
    {name: 'browse', path: '/q/:query'}
  ]);

})(this);
