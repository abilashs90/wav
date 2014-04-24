app.defineComponent({
  name: 'songs',
  api: (function() {
    'use strict';

    var uploads = new Collection('songUploads');

    function uploadSong(file) {
      var d = Q.defer(),
          formData = new FormData(),
          req = new XMLHttpRequest(),
          uploadInfo = new Reactive();

      d.promise.req = req;
      d.promise.uploadInfo = uploadInfo;

      formData.append('f', file);

      req.upload.addEventListener('progress', function(event) {
        var percent = parseInt((event.loaded*100)/event.total),
            status = 'uploading';

        d.notify(percent);

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

      req.addEventListener('error', function(event) {
        uploadInfo.write({status: 'idle', uploadError: true});
        d.reject('There was an error while uploading the file');
      });

      var userId = app.ask('user')._id;

      req.open('POST', 'http://gdrive.goje87.com/upload?user='+userId);
      req.send(formData);

      return d.promise;
    }

    function getId3(file) {
      var d = Q.defer(),
          url = file.url || file.name;

      // get the tags and image
      ID3.loadTags(url, function() {
        var tags, image;

        tags = ID3.getAllTags(url);

        var img = tags.picture;
        if (img) {
          var base64String = "";
          for (var i = 0; i < img.data.length; i++) {
              base64String += String.fromCharCode(img.data[i]);
          }
          image = "data:" + img.format + ";base64," + window.btoa(base64String);
        }

        d.resolve([tags, image]);

      }, {
        tags: ["title","artist","album","picture"],
        dataReader: FileAPIReader(file)
      });

      return d.promise;
    }

    function refreshSongsList() {
      app.collection('songs').fetch();
    }

    return {
      data: {

        songs: function() {
          var songs = app.collection('songs').read();
          return songs;
        },

        uploads: function() {
          var uploadList = uploads.read();
          return uploadList;
        }
      },

      events: {
        'click .p-songs-upload-option': function(event, template) {
          var uploadInput = template.find('.p-songs-upload-input'),
              event = document.createEvent('MouseEvents');

          event.initEvent('click', true, true);
          uploadInput.dispatchEvent(event);
        },

        'click .p-songs-refresh': function() {
          refreshSongsList();
        },

        'click .p-songs-upload-uploading': function(event, tempalte) {
          req.abort();
        },

        'change .p-songs-upload-input': function(event) {

          var fileInput = event.currentTarget;

          // // for now allow only mp3 files upload
          // if(file.type !== 'audio/mp3') {
          //   alert('Currently only mp3 files are allowed for upload. Please try again selecting mp3 format');
          //   return;
          // }

          _.toArray(fileInput.files).forEach(function(file, i) {
            var obj = {
              id: file.name,
              file: file
            };

            getId3(file)
            .spread(function(tags, image) {
              var promise = uploadSong(file),
                  uploadProgress = new Reactive;

              _.extend(obj, {
                promise: promise,
                remove: function() {
                  uploads.remove(obj);
                },
                title: tags.title || file.name,
                album: tags.album,
                artist: tags.artist,
                image: image,
                id3: tags,
                filename: file.name
              });


              uploads.add(obj);

              return promise;
            })
            .then(function(response) {
              uploads.remove(obj.id);

              if(response.isAborted) return;

              obj.id = undefined;
              obj.file = undefined;
              obj.promise = undefined;
              obj.remove = undefined;

              obj.url = response.url;

              app.collection('songs').add(obj);

              // alert(obj.title+' uploaded successfully');
            })
            .fail(function(error) {
              // alert(error);
              console.error(error);
              // uploads.remove(obj.id);
            });
          });
        },

        'click .p-songs-song': function() {
          app.component('player').ask('playSong', this);
        },

        'click .p-songs-song-delete': function() {
          app.collection('songs').remove(this.id);
        }
      },

      getRandomSong: function() {
        var songs = app.collection('songs').read(),
            randomIndex = parseInt(Math.random()*(songs.length-1)),
            randomSong = songs[randomIndex];

        return randomSong;
      },

      onRender: function() {
        setInterval(refreshSongsList, 2*60*1000);
      }
    }
  })()
})
