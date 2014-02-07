(function(GLOBAL) {
  'use strict';

  Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
  });

  Router.map(function() {

    this.route('home', {
      path: '/'
    });

  });

})(this);