/*function ReactiveDs() {
  var self = this,
      keys = {},
      deps = {},
      ensureDep = function(key) {
        if(deps[key]) return;

        deps[key] = new Deps.Dependency;
      };
  _.extend(this, {
    get: function(key) {
      ensureDep(key);

      deps[key].depend();
      return keys[key];
    },
    set: function(key, value) {
      ensureDep(key);

      keys[key] = value;
      deps[key].changed();
    },
    reactive: function(key) {
      return function() {
        return self.get(key);
      }
    }
  });
}

var dirListing = (function() {
  var baseBrowseUrl = 'http://gdrive.goje87.com/browse/',
      ds = new ReactiveDs;
  
  function updateDirectoryListing() {
    Session.set('loading', true);

    var hash = window.location.hash,
        url = baseBrowseUrl+(hash.replace('#!/', ''));

    g.jp(url+'?callback=', function(response) {
      Session.set('loading', false);
      ds.set('listing', response.listing);
    });
  }

  function init() {
    updateDirectoryListing();
    window.addEventListener('hashchange', updateDirectoryListing);
  }

  return {
    init: init,
    ds: {
      listing: ds.reactive('listing')
    },
    events: {
      'click .dir': function() {
        var browseUrl = this.browseUrl,
            browsePath = browseUrl.replace(baseBrowseUrl, '');

        if(browsePath) {
          if(browsePath[0] !== '/') browsePath = '/'+browsePath;
          window.location.hash = '!'+browsePath;
        }
      },

      'click .file .add': function() {
        playlist.add(this);
      }
    }
  };
})();

_.extend(Template.dirListing, dirListing.ds);
Template.dirListing.events(dirListing.events);

var playerDs = new ReactiveDs; //_.extend({}, reactiveDataSource);


var playlist = (function() {
  var queue = [],
      currPlaying = -1;

  Session.set('playlistQueue', queue);

  function add(item) {
    index = queue.indexOf(item);
    if(index !== -1) return;

    queue.push(item);

    Session.set('globalMessage', 
      'Added \''+item.filename+'\' to Now Playing...');

    Session.set('playlistQueue', queue);

    if(queue.length === 1) {
      play(0);
    }
  }

  function getList() {
    return queue;
  }

  function play(index) {
    var item = queue[index];
    playerDs.set('nowPlaying', item);

    currPlaying = index;
  }

  function playNext() {
    var currIndex = currPlaying,
        nextIndex = currPlaying + 1;

    if(nextIndex >= queue.length) {
      return;
    }

    play(nextIndex);
  }

  function playPrevious() {
    var prevIndex = currPlaying - 1;

    if(prevIndex < 0) {
      return;
    }

    play(prevIndex);
  }

  return {
    add: add,
    getList: getList,
    playNext: playNext,
    playPrevious: playPrevious
  };
})();


////////// APP INITIALIZATION

Meteor.startup(function() {
  // Session.set('listing', []);
  Session.set('loading', true);
  //updateDirectoryListing();

  // window.addEventListener('hashchange', updateDirectoryListing);
  dirListing.init();

  var player = document.querySelector('.js-player audio');
  playerDs.set('player', player);
  console.log(Template);
});



////////// TEMPLATE :: dirLising

// Template.dirListing.listing = function() {
//   return Session.get('listing');
// }

// Template.dirListing.events();


////////// TEMPLATE :: header

Template.header.loading = function() {
  return Session.get('loading');
};

Template.header.message = function() {
  return Session.get('globalMessage');
}


////////// TEMPLATE :: player

_.extend(Template.player, {
  path: function() {
    var nowPlaying = playerDs.get('nowPlaying');
    if(nowPlaying) return nowPlaying.playUrl;
  },

  rendered: function() {
    var player = this.find('audio');

  },

  events: {
    'playing audio': function() {
      playerDs.set('isPlaying', true);
    },

    'pause audio': function() {
      playerDs.set('isPlaying', false);
      playerDs.set('status', 'paused');
    },

    'timeupdate audio': function() {
      var player = playerDs.get('player');

      playerDs.set('progress', parseInt((player.currentTime/player.duration)*100));
      playerDs.set('status', 'playing');
    },

    'progress audio': function() {
      var player = playerDs.get('player'),
          buffered = player.buffered;

      if(!buffered.length) return;

      var start = buffered.start(0),
          end = buffered.end(0),
          buffDuration = end - start;

      playerDs.set('buffered', parseInt((buffDuration/player.duration)*100));
    },

    'waiting audio': function() {
      playerDs.set('status', 'waiting');
    },

    'ended audio': function() {
      playlist.playNext();
    }
  }
});

Template.player.preserve(['audio']);


////////// TEMPLATE :: playerControls
playerDs.setTemplate(Template.playerControls);

_.extend(Template.playerControls, {
  list: function() {
    return Session.get('playlistQueue');
  },

  progress: function() {
    return playerDs.get('progress');
  },

  events: {
    'click .player-play': function() {
      playerDs.get('player').play();
    },

    'click .player-pause': function() {
      playerDs.get('player').pause();
    },

    'click .player-next': function() {
      playlist.playNext();
    },

    'click .player-prev': function() {
      playlist.playPrevious();
    }
  }
});*/
