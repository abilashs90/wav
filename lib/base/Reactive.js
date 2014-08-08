(function(G) {

  G.Reactive = function(initialObj) {
    'use strict';

    var dep = new Deps.Dependency,
        obj = (typeof initialObj === 'undefined')?'':initialObj;

    _.extend(this, {
      read: function() {
        dep.depend();
        return obj;
      },

      write: function(newObj) {
        obj = newObj;
        dep.changed();
      },

      update: function(updateObj) {
        _.extend(obj, updateObj);
        dep.changed();
      }
    });
  };
})(this);
