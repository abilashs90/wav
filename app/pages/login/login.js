app.definePage('login', (function() {

  function loginWithFacebook() {
    app.action('loginUser', 'facebook', {
      requestOfflineToken: true
    },
    function(error) {
      if(error) throw error;

      alert('Login was successful');
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
})());