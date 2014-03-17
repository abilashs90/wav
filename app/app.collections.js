(function() {
  'use strict';

  app.defineCollection('albums', (function() {
    function server() {
      var args = _.toArray(arguments);
      args.unshift('callServerMethod');
      return app.action.apply(this, args);
    }

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

})();
