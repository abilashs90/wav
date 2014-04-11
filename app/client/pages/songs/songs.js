app.defineComponent({
  name: 'songs',
  api: (function() {
    var uploadInfo = new Reactive(),
        req = null;

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
              formData = new FormData(),
              tags, image;

          req = new XMLHttpRequest();

          // for now allow only mp3 files upload
          if(file.type !== 'audio/mp3') {
            alert('Currently only mp3 files are allowed for upload. Please try again selecting mp3 format');
            return;
          }

          formData.append('f', file);
          // formData.append('user', app.ask('user')._id);

          req.upload.addEventListener('progress', function(event) {
            var percent = parseInt((event.loaded*100)/event.total),
                status = 'uploading';

            uploadInfo.write({status: status, percent: percent});

          });

          req.addEventListener('load', function(event) {
            var response = JSON.parse(event.target.responseText);

            if(!response.success) {
              uploadInfo.write({status: 'idle'});
              alert('There was a error while storing the file on server');
              return;
            }

            uploadInfo.write({status: 'idle'});
            alert('Uploaded successfully!');

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
          });

          req.addEventListener('abort', function() {
            uploadInfo.write({status: 'idle'});
          });

          req.addEventListener('error', function() {
            uploadInfo.write({status: 'idle'});
            alert('There was an error while uploading');
          });

          var userId = app.ask('user')._id;

          req.open('POST', 'http://gdrive.goje87.com/upload?user='+userId);
          req.send(formData);

          var url = file.url || file.name;

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
