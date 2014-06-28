ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "554911724631095",
  secret: "f3f7614e7bda918e71256d3122400001"
});

Accounts.onCreateUser(function(options, user) {

  if (options.profile) user.profile = options.profile;

  user._id = user.services.facebook.id;

  return user;
});
