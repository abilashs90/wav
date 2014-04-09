app.defineComponent({
  name: 'globalActivity',
  api: (function() {
    'use strict';

    var activities = [],
        globalMessage = new Reactive('');

    function startActivity(name, message) {
      var i = getActivityIndex(name);

      if(i >= 0) activities.splice(i, 1);

      activities.unshift({
        name: name,
        message: message
      });

      globalMessage.write(message);
    }

    // returns index of the activity with given `name`.
    // returns -1 if not found
    function getActivityIndex(name) {
      for(var i=0; i<activities.length; i++) {
        var activity = activities[i];

        if(activity.name === name) return i;
      }

      return -1;
    }

    function stopActivity(name) {
      var i = getActivityIndex(name);

      if(i === -1) return;

      activities.splice(i, 1);

      globalMessage.write(activities.length?activities[0].message:'');
    }

    return {

      data: {
        message: function() {
          return globalMessage.read();
        },
        showActivity: function() {
          return globalMessage.read().length;
        }
      },

      start: startActivity,
      stop: stopActivity
    }
  })()
})
