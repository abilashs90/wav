(function() {
  'use strict';

  // TODO: 'Meteor' should not be used directly here. Try to get rid of all the
  //       instances of 'Meteor' in this file.


  function acsUrl(endpoint, session) {
    var base = 'https://api.cloud.appcelerator.com/v1/',
        appKey = 'zDzk2GfKPRNYu8mMB4NqccyRl1w0MAEn';

    return base+endpoint+'.json?key='+appKey+(session?'&_session_id='+session:'');
  }

  function callAcs(config) {
    config = _.extend({
      useSession: false,
      method: 'GET',
      returnFullResponse: false
    }, config);

    var user = Meteor.user();
    user.cloud = user.cloud || {};

    var cloudUserId = user.cloud.id,
        cloudSessionId = user.cloud.session;

    // If the call requires session and no cloud session is found,
    // then try to re-authenticate user on cloud
    if(config.useSession && !cloudSessionId) {
      console.warn('Cloud session required for call but not found');

      try {
        loginCloudWithFacebook();
      }
      catch(ex) {
        return new Meteor.Error(403, 'authenticate_user', ex.stack);
      }
    }

    var url = acsUrl(config.endpoint, cloudSessionId);


    // try {
    console.log('cloud ', config.method, ' ', url);
    var response = HTTP.call(config.method, url, {params: config.params});
    console.log('cloud ', response.statusCode, ' ', response.data.meta);

    if(response.data.meta && response.data.meta.session_id) {
      cloudSessionId = response.data.meta.session_id;
    }


    if(config.returnFullResponse) {
      return response.data;
    }
    else {
      return response.data.response?response.data.response.wav:null;
    }

    // }
    // catch (ex) {
    //   throw new Meteor.Error(500, 'cloud_shit', ex.stack);
    // }
  }

  function loginCloudWithFacebook() {
    var user = Meteor.user();

    if(!user) throw new Meteor.Error(403, 'authenticate_user');
    if(!user.services) throw new Meteor.Error(403, 'authenticate_user_service');

    var type = 'facebook',
        serviceData = user.services[type],
        params = {
          id: serviceData.id,
          token: serviceData.accessToken,
          type: type
        };

    var ret = callAcs({
      endpoint: 'users/external_account_login',
      method: 'POST',
      params: params,
      returnFullResponse: true
    });

    var response = ret.response,
        meta = ret.meta,
        cloudUserId = response.users[0].id,
        cloudSessionId = meta.session_id;

    Meteor.users.update(user._id, {$set: {
      cloud: {
        id: cloudUserId,
        session: cloudSessionId
      }
    }});

    return response;
  }

  var cloud = (function() {

    function createObject(data) {
      return callAcs({
        endpoint: 'objects/wav/create',
        method: 'POST',
        useSession: true,
        params: {
          fields: JSON.stringify(data),
          acl_name: 'private'
        }
      });
    }

    function getObjects(params) {
      return callAcs({
        endpoint: 'objects/wav/query',
        method: 'GET',
        params: params
      });
    }

    function removeObject(id) {
      return callAcs({
        endpoint: 'objects/wav/delete',
        method: 'DELETE',
        useSession: true,
        params: {
          id: id
        }
      });
    }

    return {
      createObject: createObject,
      getObjects: getObjects,
      removeObject: removeObject
    }
  })();

  Meteor.methods({
    loginCloudWithFacebook: loginCloudWithFacebook,

    addAlbum: function(data) {
      this.unblock();

      data.type = 'album';
      return cloud.createObject(data);
    },

    getAlbums: function() {
      this.unblock();

      var where = {type: 'album'};

      return cloud.getObjects({where: JSON.stringify(where)});
    },

    removeAlbum: function(albumId) {
      this.unblock();

      return cloud.removeObject(albumId);
    },

    addSong: function(data) {
      this.unblock();

      data.type = 'song';
      return cloud.createObject(data);
    },

    getSongs: function() {
      this.unblock();

      var user = app.user(),
          params = {
            where: JSON.stringify({type: 'song', user_id: user.cloud.id}),
            unsel: JSON.stringify({all: ['id3']}),
            limit: 1000  // ACS doc says limit cannot exceed 1000
          };

      return cloud.getObjects(params);
    },

    removeSong: function(songId) {
      this.unblock();

      return cloud.removeObject(songId);
    }
  });
})();
