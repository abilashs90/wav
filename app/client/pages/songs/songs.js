app.defineComponent({
  name: 'songs',
  api: (function() {
    var uploadInfo = new Reactive();

    function uploadSong(file) {
      var d = Q.defer(),
          formData = new FormData(),
          req = new XMLHttpRequest();

      formData.append('f', file);

      req.upload.addEventListener('progress', function(event) {
        var percent = parseInt((event.loaded*100)/event.total),
            status = 'uploading';

        uploadInfo.write({status: status, percent: percent});
      });

      req.addEventListener('load', function(event) {
        var response = JSON.parse(event.target.responseText);

        if(!response.success) {
          uploadInfo.write({status: 'idle'});
          d.reject('There was an error while storing the file on server');
          return;
        }

        uploadInfo.write({status: 'idle'});
        d.resolve(response);
      });

      req.addEventListener('abort', function() {
        uploadInfo.write({status: 'idle'});
        d.resolve({isAborted: true});
      });

      req.addEventListener('error', function() {
        uploadInfo.write({status: 'idle'});
        d.reject('There was as error while uploading');
      });

      var userId = app.ask('user')._id;

      req.open('POST', 'http://gdrive.goje87.com/upload?user='+userId);
      req.send(formData);

      return d.promise;
    }

    return {
      data: {
        isUploading: function() {
          return uploadInfo.read().status === 'uploading';
        },

        percentUploaded: function() {
          return uploadInfo.read().percent;
        },

        songs: function() {
          var songs = app.collection('songs').read();
          return songs;
        }
      },

      events: {
        'click .p-songs-upload-option': function(event, template) {
          var uploadInput = template.find('.p-songs-upload-input'),
              event = document.createEvent('MouseEvents');

          event.initEvent('click', true, true);
          uploadInput.dispatchEvent(event);
        },

        'click .p-songs-upload-uploading': function(event, tempalte) {
          req.abort();
        },

        'change .p-songs-upload-input': function(event) {

          var fileInput = event.currentTarget,
              file = fileInput.files[0],
              tags, image,
              url = file.url || file.name;

          // for now allow only mp3 files upload
          if(file.type !== 'audio/mp3') {
            alert('Currently only mp3 files are allowed for upload. Please try again selecting mp3 format');
            return;
          }

          ID3.loadTags(url, function() {

            tags =   ID3.getAllTags(url);

            var img = tags.picture;
            if (img) {
              var base64String = "";
              for (var i = 0; i < img.data.length; i++) {
                  base64String += String.fromCharCode(img.data[i]);
              }
              image = "data:" + img.format + ";base64," + window.btoa(base64String);
            }
          }, {
            tags: ["title","artist","album","picture"],
            dataReader: FileAPIReader(file)
          });

          uploadSong(file)
          .then(function(response) {
            if(response.isAborted) return;

            var obj = {
              title: tags.title,
              album: tags.album,
              artist: tags.artist,
              image: image,
              url: response.url,
              id3: tags,
              filename: file.name
            };

            app.collection('songs').add(obj);

            alert('Song uploaded successfully');
          })
          .fail(function(error) {
            alert(error);
          });

        },

        'click .p-songs-song': function() {
          app.component('player').ask('playSong', this);
        }
      },

      getRandomSong: function() {
        var songs = app.collection('songs').read(),
            randomIndex = parseInt(Math.random()*(songs.length-1)),
            randomSong = songs[randomIndex];

        return randomSong;
      }
    }
  })()
})
