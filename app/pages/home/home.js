app.definePage('home', (function() {
  app.action('callServerMethod', 'getUserId', function(error, userId) {
      if(error) throw 'Error while checking if user is logged in. '+error;
      console.log(userId);
    });

  var redirectUrl = '/b'; // redirect here when login is successful

  function loginWithFacebook() {
    Meteor.loginWithFacebook({
      requestOfflineToken: true
    }, function(error) {

      if(error) throw 'There was an error: '+error;

      app.action('redirect', redirctUrl);
    });
  }

  function onPageRender() {
    app.action('callServerMethod', 'getUserId', function(error, userId) {
      if(error) throw 'Error while checking if user is logged in. '+error;
      if(!userId) return;

      console.log(userId);

      app.action('redirect', redirectUrl);
    });
  }

  return {
    data: {
      name: 'Goje87'
    },

    onPageRender: onPageRender,

    events: {
      'click .p-home-login-facebook': function() {
        loginWithFacebook();
      }
    }
  }
})());