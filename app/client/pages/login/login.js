app.defineComponent({
  name: 'login',
  api: (function() {

    function loginWithFacebook() {
      app.ask('login', 'facebook', {
        requestOfflineToken: true
      },
      function(error) {
        if(error) throw error;

        // on successful login, go to homepage.
        app.action('redirect', 'home');
      });
    }

    return {
      data: {
        jsonString: function(data) {
          return JSON.stringify(data);
        }
      },
      events: {
        'click  .p-login-button-facebook': function() {
          loginWithFacebook();
        }
      }
    }
  })()
});
