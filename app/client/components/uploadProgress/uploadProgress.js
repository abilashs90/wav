app.defineComponent({
  name: 'uploadProgress',
  api: function() {
    'use strict';

    this.data = {
      progress: function() {
        if(!this.promise || !this.promise.uploadInfo) return;

        return this.promise.uploadInfo.read().percent;
      },

      error: function() {
        if(!this.promise || !this.promise.uploadInfo) return;

        return this.promise.uploadInfo.read().uploadError === true;
      }
    };

    this.events = {
      'click .c-uploadProgress-cancel': function() {
        console.log('aborting for ', this);
        this.promise.req.abort();
        this.remove();
      }
    }
  }
})
