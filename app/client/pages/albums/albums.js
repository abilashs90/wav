app.defineComponent({
  name: 'albums',
  api: (function() {

    return {
      data: {
        albums: function() {
          return app.collection('albums').read(true);
        }
      }
    }
  })()
});
