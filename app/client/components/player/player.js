app.defineComponent({
  name: 'player',
  api: (function() {
    var nativePlayer,
        playerData = {
          currSong: new Reactive(),
          status: new Reactive(),
          progress: new Reactive(),
          buffer: new Reactive()
        };

    function playSong(song) {
      playerData.currSong.write(song);
    }

    function play() {
      nativePlayer.play();
    }

    function pause() {
      nativePlayer.pause();
    }

    var handleProgress = _.throttle(function() {
      var currTime = nativePlayer.currentTime,
          duration = nativePlayer.duration,
          progress = parseInt((currTime/duration)*100);

      playerData.progress.write(progress);
    }, 1000);

    var handleBuffer = _.throttle(function() {
      var buffered = nativePlayer.buffered;

      if(!buffered.length) return;

      var start = buffered.start(0),
          end = buffered.end(0),
          buffDuration = end - start,
          duration = nativePlayer.duration;

      playerData.buffer.write(parseInt((buffDuration/duration)*100));
    }, 1000);

    // setTimeout(function() {
    //   playSong({
    //     "title":"Long Road Ahead",
    //     "album":"Celtic and Folk",
    //     "artist":"Kevin MacLeod",
    //     "image":"data:JPG;base64,/9j/4AAQSkZJRgABAgEASABIAAD/4R1IRXhpZgAATU0AKgAAAAgABwESAAM…fUfVm/3nbqnqc/U79efLFbTTTtNs9H0200nTo/R0+wgjtbSHkz8IYECIvJyWNFAFSScVt//9k=",
    //     "url":"http://gdrive.goje87.com/read/709834016/1396539697-Long Road Ahead.mp3",
    //     "type":"song",
    //     "id":"533d8139ed8cdc0b3900377c",
    //     "created_at":"2014-04-03T15:41:45+0000",
    //     "updated_at":"2014-04-03T15:41:45+0000",
    //   });
    // }, 2000);

    return {
      data: {
        title: function() {
          return playerData.currSong.read().title;
        },

        path: function() {
          return playerData.currSong.read().url;
        },

        image: function() {
          return playerData.currSong.read().image;
        },

        album: function() {
          return playerData.currSong.read().album;
        },

        artist: function() {
          return playerData.currSong.read().artist;
        },

        progress: function() {
          return playerData.progress.read();
        },

        buffer: function() {
          return playerData.buffer.read();
        },

        statusIs: function(status) {
          return playerData.status.read() === status;
        }
      },

      onRender: function() {
        nativePlayer = this.find('.c-player-native');
      },

      events: {
        'playing .c-player-native': function() {
          playerData.status.write('playing');
        },

        'pause .c-player-native': function() {
          playerData.status.write('paused');
        },

        'timeupdate .c-player-native': handleProgress,

        'progress .c-player-native': handleBuffer,

        'waiting .c-player-native': function() {
          playerData.status.write('waiting');
        },

        'ended .c-player-native': function() {
          playerData.status.write('ended');
        },

        'loadeddata .c-player-native': function(event) {
          play();
        },

        'loadstart .c-player-native': function(event) {
          playerData.status.write('loading');
        },

        'click .c-player-control-play': function() {
          play();
        },

        'click .c-player-control-pause': function() {
          pause();
        }
      },

      playSong: playSong,
    };
  })()
});
