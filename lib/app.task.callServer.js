(function() {
  'use strict';

  app.tasks.add('callServer', function() {
    return Meteor.call.apply(this, arguments);
  });

})();
