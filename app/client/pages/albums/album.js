app.defineComponent({
  name: 'album',
  api: (function() {
    return {
      data: {
        album: function() {
          return app.collection('albums').getObjectById(app.param('id'));
        }
      },

      events: {
        'click .p-album-delete': function() {
          app.collection('albums').remove(app.param('id'), function() {
            app.action('redirect', 'albums');
          });
        }
      }
    };
  })()
});
