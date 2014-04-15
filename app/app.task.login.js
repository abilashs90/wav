(function() {
  'use strict';

  app.tasks.add('login', function(service, config, callback) {
    app.login(service, config, function(error) {
      try {
        if(error) throw error;

        app.component('globalActivity')
        .ask('start', 'connectCloud', 'Connecting to your cloud...');

        app.ask('callServer', 'loginCloudWithFacebook', function(error) {
          app.component('globalActivity').ask('stop', 'connectCloud');

          callback.call(this, error);
        });
      }
      catch(ex) {
        app.component('globalActivity').ask('stop', 'connectCloud');
        callback.call(this, ex);
      }


    });
  });

  app.tasks.add('user', function() {
    return Meteor.user();
  });
})();
