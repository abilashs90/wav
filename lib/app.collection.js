(function() {
  'use strict';

  var collections = {};
  app.defineCollection = function(name, config) {
    config = config || {};

    var collection = collections[name] || new Collection(name);
    collection.setRemoteServer(config.remote);

    collections[name] = collection;
  }


  app.collection = function(name) {
    if(!name) return;

    return collections[name];
  }
})();
