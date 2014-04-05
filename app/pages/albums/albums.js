app.defineComponent({
  name: 'albums',
  api: (function() {

    return {
      data: {
        albums: function() {
          return app.collection('albums').read(true);
        },

        listMessage: function() {
          var status = app.collection('albums').getStatus();

          if(status === 'fetching') {
            return 'Updating the list';
          }
          else return null;
        }
      }
    }
  })()
});
