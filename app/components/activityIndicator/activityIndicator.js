app.defineComponent({
  name: 'activityIndicator',
  api: (function() {
    var activities = [],
        showIndicator = new Reactive();

    showIndicator.write(false);

    function addActivity(name) {
      if(_.indexOf(activities, name) !== -1) return;

      activities.push(name);
      updateStatus();
    }

    function removeActivity(name) {
      var index = _.indexOf(activities, name);
      if(index === -1) return;

      activities.splice(index, 1);
      updateStatus();
    }

    function updateStatus() {
      if(activities.length === 0) {
        showIndcator.write(false);
      }
      else {
        showIndcator.write(true);
      }
    }

    return {
      start: function(name) {
        addActivity(name);
      },
      stop: function(name) {
        removeActivity(name);
      },
      data: {
        showIndicator: function() {
          return showIndicator.read();
        }
      }
    }
  })()
});
