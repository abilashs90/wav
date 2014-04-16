(function(G) {
  'use strict';

  var components = {},
      blankFunc = function() {};

  function defineComponent(config) {
    // processing required by client
    if(!Meteor.isClient) return;

    config = _.extend({
      api: {}
    }, config);

    var name = config.name,
        apiKlass = klass(config.api);

    if(!name || !apiKlass) return;

    components[name] = config;
    var api = new apiKlass();

    var template = Template[name];
    if(!template) return;

    var data = api.data || {};
    // if(_.isFunction(data)) data = data.call();
    _.extend(template, data);

    template.events(api.events);
    if(api.onRender && _.isFunction(api.onRender)) {
      template.rendered = api.onRender;
    }
  }

  function getComponentSandbox(sel) {
    if(!_.isString(sel)) return;

    var component = components[sel];
    if(!component) throw 'Component ['+sel+'] is not defined (yet!).';

    var sandbox = {
      ask: function() {
        var args = _.toArray(arguments),
            command = args.shift(),
            method = component.api[command];

        if(!method) throw 'Component ['+component.name+'] does not expose method ['+command+']';

        return method.apply(this, args);
      }
    };

    return sandbox;
  }

  if(Meteor.isClient) {
    Handlebars.registerHelper('component', function(templateName, options) {
      return new Handlebars.SafeString(Template[templateName]({}));
    });
  }

  _.extend(app, {
    defineComponent: defineComponent,
    component: getComponentSandbox
  });
})(this);
