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
        api = config.api;

    if(!name || !api) return;

    components[name] = config;

    // if(_.isFunction(api)) {
    //   api = api.call(this);
    // }

    if(_.isString(config.extend) && components[config.extend]) {
      // Lets not support multiple extend for now
      //_.extend.apply(this, config.extend.push(api));
      var parentApi = components[config.extend].api,
          parentConstructor = parentApi._constructor || blankFunc,
          currentConstructor = api._constructor || blankFunc;

      _.extend(api, parentApi);

      api._constructor = function() {
        parentConstructor.apply(api, arguments);
        currentConstructor.apply(api, arguments);
      }
    }

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

  function getComponent(sel) {
    if(!_.isString(sel)) return;

    var component = components[sel];
    if(!component) throw 'Component ['+sel+'] is not defined (yet!).';

    var sandbox = {
      ask: function() {
        var args = _.toArray(arguments),
            command = args.shift(),
            method = component.api[command];

        if(!method) throw 'Component ['+component.name+'] does not expose method ['+command+']';

        method.apply(this, args);
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
    component: getComponent
  });
})(this);
