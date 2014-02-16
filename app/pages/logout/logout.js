app.definePage('logout', (function() {

  var redirectUrl = '/';

  function logoutUser() {
    console.log('calling logoutUser');
    Meteor.logout(function() {
      app.action('redirect', redirectUrl);
    });
  }

  return {
    data: {
      redirectUrl: redirectUrl
    },
    onPageRender: logoutUser
  }
})());