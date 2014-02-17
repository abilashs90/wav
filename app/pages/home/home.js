app.definePage('home', (function() {

  var redirectTo = 'browse'; // redirect here when login is successful

  function loginWithFacebook() {
    app.action('loginUser', 'facebook', {
      requestOfflineToken: true
    }, function(error) {

      if(error) throw 'There was an error: '+error;

      app.action('redirect', redirectTo);
    });
  }

  function onPageRender() {
    app.action('callServerMethod', 'getUserId', function(error, userId) {
      if(error) throw 'Error while checking if user is logged in. '+error;
      if(!userId) return;

      app.action('redirect', redirectTo);
    });
  }

  app.on('newAppUserCreated', function(user) {
    app.action('callServerMethod', 'loginOnAcsWithFacebook', user, function(err, data) {
      if(err) throw 'There was an error while creating user accoung on ACS. ', err;

      console.log(arguments);
    });
  });

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