(function() {
  'use strict';

  var tasks = {};

  function addTask(name, handle) {
    tasks[name] = handle;
  }

  function executeTask() {
    var args = _.toArray(arguments),
        name = args.shift(),
        handle = tasks[name];

    if(!handle) throw 'Task '+name+' not found';

    return handle.apply(this, args);
  }

  _.extend(app, {
    tasks: {
      add: addTask,
      execute: executeTask
    },

    ask: executeTask
  });
})();
