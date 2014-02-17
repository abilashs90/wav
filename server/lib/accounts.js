Accounts.loginServiceConfiguration.remove({
  service: "facebook"
});
Accounts.loginServiceConfiguration.insert({
  service: "facebook",
  appId: "1421997598041592",
  secret: "3fb7c0b0a60080c813eb373b2870dfdb"
});

Accounts.onCreateUser(function(options, user) {
  app.trigger('newAppUserCreated', user);
  return user;
});

/*
https://www.facebook.com/dialog/oauth?client_id=undefined&redirect_uri=http://localhost:3000/_oauth/facebook?close&display=touch&scope=email&state=eA3Fm4MjCttJrMJpD
*/