(function() {
  'use strict';

  app.tasks.add('login', function(service, config, callback) {
    app.login(service, config, function(error) {
      try {
        if(error) throw error;

        app.action('callServerMethod', 'loginCloudWithFacebook', function(error) {
          callback.call(this, error);
        });
      }
      catch(ex) {
        callback.call(this, ex);
      }


    });
  });

  app.tasks.add('user', function() {
    return Meteor.user();
  });
})();
