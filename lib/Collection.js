(function(G) {
  'use strict';

  G.Collection = klass(function(name) {
    var deps = new Deps.Dependency,
        dataset = [],
        handlerMap = {},
        self = this,
        statuses = {
          virgin: 'virgin', // just created
          fetching: 'fetching', // updating self from remote
          chilling: 'chilling' // doing nothing; just chilling
        },
        status = new Reactive(statuses.virgin),
        alreadyRead = false,
        remoteServer = {};


    function getIndexForObject(objId) {
      for(var i = 0; i < dataset.length; i++) {
        var obj = dataset[i];

        if(obj.id == objId) continue;

        return i;
      }
    }

    function getObjectById(objId) {
      var index = getIndexForObject(objId);

      return dataset[index];
    }

    function trigger(event, args) {
      var handlers = handlerMap[event];

      if(!handlers) return;

      for(var i = 0; i < handlers.length; i++) {
        handlers[i].apply(self, args);
      }
    }

    function datasetChanged() {
      var args = _.toArray(arguments),
          action = args.shift();

      if(action) trigger(action, args);
      //if(action !== 'fetchEnd') fetch();
      status.write(statuses.chilling);
      deps.changed();
    }

    function fetch() {
      if(_.isFunction(remoteServer.fetch)) {
        trigger('fetchStart');
        status.write(statuses.fetching);

        remoteServer.fetch(function(fetchedDataset) {
          dataset = fetchedDataset;
          datasetChanged('fetchEnd');
        });
      }
    }

    function syncRemote() {
      var args = _.toArray(arguments),
          action = args.shift();

      console.log('syncRemote trying to perform action ', action, ' with  ', args);

      if(!_.isFunction(remoteServer[action])) return;

      if(_.isFunction(args[args.length - 1])) {
        var callback = args.pop();
      }

      args.push(function(err) {
        fetch();
        if(err) {
          alert('There was an error while syncing with the cloud. It said '+err);
          console.log(err.stack);
        }
        callback && callback.apply(this, arguments)
      });

      remoteServer[action].apply(this, args)
    }

    this.name = name;

    this.getStatus = function() {
      return status.read();
    }

    this.read = function() {
      if(!alreadyRead) {
        fetch();
        alreadyRead = true;
      }
      deps.depend();
      return dataset;
    };

    this.getObjectById = function(objId) {
      this.read();

      for(var i=0; i<dataset.length; i++) {
        var obj = dataset[i];
        if(obj.id === objId) return obj;
      }
    }

    this.write = function(newDataset) {
      dataset = newDataset;
      datasetChanged('write', newDataset);
    };

    this.add = function(obj, callback) {
      dataset.push(obj);
      syncRemote('add', obj, callback);

      datasetChanged('add', obj);
    };

    this.remove = function(objId, callback) {
      var index = getIndexForObject(objId);

      dataset.splice(index, 1);
      syncRemote('remove', objId, callback);

      datasetChanged('remove', objId);
    };

    this.update = function(objId, updateObj, callback) {
      var index = getIndexForObject(objId);

      _.extend(dataset[index], updateObj);
      syncRemote('update', objId, updateObj, callback);

      datasetChanged('update', objId, updateObj);
    };

    this.on = function(event, handler) {
      (handlerMap[event] = handlerMap[event] || []).push(handler);
    };

    this.setRemoteServer = function(server) {
      remoteServer = server;
    }

    this.addOrUdate = function(obj, callback) {
      if(!obj.id) this.add(obj, callback);

      var id = obj.id,
          ind = getIndexForObject(id);

      // valid index means obj is found in collection. So, update it
      if(ind >= 0) this.update(id, obj, callback);
      else this.add(obj, callback);
    };
  });
})(this);
