(function(G) {
  'use strict';

  _.extend(app, {
    user: function() {
      return Meteor.user();
    }
  });
})(this);
