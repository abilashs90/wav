(function(G) {
  'use strict';

  function defineComponent(config) {
    // processing required by client
    if(!Meteor.isClient) return;

    config = _.extend({
      api: {}
    }, config);

    var name = config.name,
        api = config.api;
    
    if(!name) return;

    if(_.isFunction(api)) {
      api = api.call(this);
    }

    if(api.extends) {
      _.extend.apply(this, api.extends.push(api));
    }

    var template = Template[name];
    if(!template) return;

    var data = api.data || {};
    if(_.isFunction(data)) data = data.call();
    _.extend(template, data);

    template.events(api.events);
    if(api.onRender && _.isFunction(api.onRender)) {
      template.rendered = api.onRender
    }
  }

  if(Meteor.isClient) {
    Handlebars.registerHelper('component', function(templateName, options) {
      return new Handlebars.SafeString(Template[templateName]({}));
    });
  }

  _.extend(app, {
    defineComponent: defineComponent
  });
})(this);
