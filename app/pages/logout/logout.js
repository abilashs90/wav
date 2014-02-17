app.definePage('logout', (function() {

  var redirectTo = 'home';

  function logoutUser() {
    console.log('calling logoutUser');
    Meteor.logout(function() {
      app.action('redirect', redirectTo);
    });
  }

  return {
    data: {
      redirectUrl: app.url(redirectTo)
    },
    onPageRender: logoutUser
  }
})());