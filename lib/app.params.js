(function(G) {
  'use strict';

  var params = new Reactive();

  Router.before(function() {
    params.write(this.params);
  });

  _.extend(app, {
    param: function(name) {
      var p = params.read();
      if(!p[name]) return;

      return p[name];
    }
  })

})(this);
