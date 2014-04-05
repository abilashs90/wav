(function() {
  'use strict';

  function server() {
    var args = _.toArray(arguments);
    args.unshift('callServerMethod');
    return app.action.apply(this, args);
  }

  app.defineCollection('albums', (function() {

    return {
      remote: {
        fetch: function(fetched) {
          server('getAlbums', function(error, data) {
            fetched(data);
          });
        },

        add: function(obj, callback) {
          server('addAlbum', obj, callback);
        },

        remove: function(objId, callback) {
          server('removeAlbum', objId, callback);
        },

        update: function(objId, updateObj, callback) {
          server('updateAlbum', objId, updateObj, callback);
        }
      }
    };
  })());

  app.defineCollection('songs', (function() {

    return {
      remote: {
        fetch: function(fetched) {
          server('getSongs', function(error, data) {
            fetched(data);
          });
        },

        add: function(obj, callback) {
          server('addSong', obj, callback);
        },

        remove: function(objId, callback) {
          server('removeSong', objId, callback);
        },

        update: function(objId, updateObj, callback) {
          server('updateSong', objId, updateObj, callback);
        }
      }
    };
  })());

})();
