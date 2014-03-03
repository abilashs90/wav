function acsUrl(endpoint) {
  var base = 'https://api.cloud.appcelerator.com/v1/',
      appKey = 'zDzk2GfKPRNYu8mMB4NqccyRl1w0MAEn';

  return base+endpoint+'.json?key='+appKey;
}

Meteor.methods({
  loginOnAcsWithFacebook: function() {
    var user = Meteor.user();

    if(!user.services) throw 'Cannot Find Services data';

    var type = 'facebook',
        serviceData = user.services[type],
        params = {
          id: serviceData.id,
          token: serviceData.accessToken,
          type: type
        };


    return HTTP.call(
      'POST',
      acsUrl('users/external_account_login'),
      {params: params }
    );
  },

  crateAlbum: function(data) {

  }
});
