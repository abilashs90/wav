(function() {
  'use strict';

  _.extend(app, {
    login: function(service, config, callback) {
      ({

        'facebook': function() {
          Meteor.loginWithFacebook(config, callback);
        }

      })[service].call(this);
    },

    user: function() {
      return Meteor.user();
    }
  });
})();
