Meteor.methods({
  loginOnAcsWithFacebook: function() {
    var user = Meteor.user();

    if(!user.services) return; 

    var type = 'facebook',
        serviceData = user.services[type],
        params = {
          id: serviceData.id,
          token: serviceData.accessToken,
          type: type
        },
        appKey = 'zDzk2GfKPRNYu8mMB4NqccyRl1w0MAEn';


    return HTTP.call(
      'POST', 
      'https://api.cloud.appcelerator.com/v1/users/external_account_login.json?key='+appKey,
      {params: params }
    );
  }
});