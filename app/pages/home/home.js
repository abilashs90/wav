app.definePage('home', (function() {
  // app.action('callServerMethod', 'getUserId', function(err, userId) {
  //   console.log('getUserId: ', arguments);
  //   if(userId) app.action('redirect', '/b');
  // });
  
  app.action('callServerMethod', 'getUser', function(err, user) {
    console.log('user: ', user);
  });

  return {
    data: {
      name: 'Goje87'
    },
    events: {
      'click .p-home-login-facebook': function() {
        // first, remove configuration entry in case service is already configured

        Meteor.loginWithFacebook({
          requestOfflineToken: true
        }, function(error) {
          if (error) alert('There was an error: '+error);

          app.action('redirect', '/b');
        });
      }
    }
  }
})());