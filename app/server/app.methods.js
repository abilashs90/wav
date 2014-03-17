(function() {
  'use strict';

  // TODO: 'Meteor' should not be used directly here. Try to get rid of all the
  //       instances of 'Meteor' in this file.

  var cloudSessionId;

  function acsUrl(endpoint, session) {
    var base = 'https://api.cloud.appcelerator.com/v1/',
        appKey = 'zDzk2GfKPRNYu8mMB4NqccyRl1w0MAEn';

    return base+endpoint+'.json?key='+appKey+(session?'&_session_id='+session:'');
  }

  function callAcs(config) {
    config = _.extend({
      useSession: false,
      method: 'GET'
    }, config);

    // If the call requires session and no cloud session is found,
    // then try to re-authenticate user on cloud
    if(config.useSession && !cloudSessionId) {
      console.warn('Cloud session required for call but not found');

      try {
        loginCloudWithFacebook();
      }
      catch(ex) {
        return new Meteor.error(403, 'authenticate_user', ex.stack);
      }
    }

    var url = acsUrl(config.endpoint, cloudSessionId);

    try {
      var response = HTTP.call(config.method, url, {params: config.params});
      if(response.data.meta && response.data.meta.session_id) {
        cloudSessionId = response.data.meta.session_id;
      }
      
      return response.data.response.wav;
    }
    catch (ex) {
      return new Meteor.error(500, 'cloud_shit', ex.stack);
    }
  }

  function loginCloudWithFacebook() {
    var user = Meteor.user();

    if(!user) throw new Meteor.error(403, 'authenticate_user');
    if(!user.services) throw new Meteor.error(403, 'authenticate_user_service');

    var type = 'facebook',
        serviceData = user.services[type],
        params = {
          id: serviceData.id,
          token: serviceData.accessToken,
          type: type
        };

    var res = callAcs({
      endpoint: 'users/external_account_login',
      method: 'POST',
      params: params
    });

    return res;
  }

  Meteor.methods({
    loginCloudWithFacebook: loginCloudWithFacebook,

    addAlbum: function(data) {

      this.unblock();

      data.type = 'album';

      return callAcs({
        endpoint: 'objects/wav/create',
        method: 'POST',
        useSession: true,
        params: {
          fields: JSON.stringify(data)
        }
      });
    },

    getAlbums: function() {
      this.unblock();

      var where = {type: 'album'};
      
      return callAcs({
        endpoint: 'objects/wav/query',
        method: 'GET',
        params: {
          where: JSON.stringify(where)
        }
      });
    }
  });
})();
