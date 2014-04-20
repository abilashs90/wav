app.defineComponent({
  name: 'uploadProgress',
  api: function() {

    this.data = {
      progress: function() {
        return this.promise.uploadInfo.read().percent;
      }
    };

    this.events = {
      'click .c-uploadProgress-cancel': function() {
        console.log('aborting for ', this);
        this.promise.req.abort();
      }
    }
  }
})
