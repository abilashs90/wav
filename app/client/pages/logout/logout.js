app.defineComponent({
  name: 'logout',
  api: (function() {
    var redirectTo = 'home';

    function logoutUser() {
      Meteor.logout(function() {
        app.action('redirect', redirectTo);
      });
    }

    return {
      data: {
        redirectUrl: app.url(redirectTo)
      },
      onRender: logoutUser
    }
  })()
});
