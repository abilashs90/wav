ServiceConfiguration.configurations.remove({
  service: "facebook"
});
 
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "1421997598041592",
  secret: "3fb7c0b0a60080c813eb373b2870dfdb"
});

Accounts.onCreateUser(function(options, user) {

  if (options.profile) user.profile = options.profile;

  user._id = user.services.facebook.id;

  return user;
});
