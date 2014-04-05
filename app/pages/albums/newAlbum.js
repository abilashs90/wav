app.defineComponent({
  name: 'newAlbum',
  api: (function() {

    return {
      events: {
        'submit .p-newAlbum-form': function(event, template) {
          try {
            var title = template.find('.p-newAlbum-title').value,
                year = template.find('.p-newAlbum-year').value;

            app.collection('albums').add({
              title: title,
              year: year
            }, function(err, response) {
              if(err) throw err;

              app.action('redirect', 'albums');
            });
          }
          catch (ex) {
            alert(ex);
            console.log(ex.stack);
          }
          return false;
        }
      }
    };
  })()
});
