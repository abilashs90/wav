app.defineComponent({
    name: 'home',
    api: (function() {
        var inputType = new Reactive('is-voice-input'),
            inputStatus = new Reactive('is-not-listening');

        function searchQuery (q) {
            Meteor.http.call("GET", "http://172.17.88.254/InternalApi/QuickKart/search?q="+q,function(searchResult,error){
                console.log(searchResult,error);
            });           
        }

        return {
            data: {
              inputType: function() {
                return inputType.read();
              },
              inputStatus: function() {
                return inputStatus.read();
              }
            },
            events: {
                'click .p-home-icon-cont': function() {
                    inputType.write('is-voice-input');
                    inputStatus.write('is-listening');
                    app.ask('startListning', function (text) {
                        inputStatus.write('is-finished-listening');
                        this.$(".search-text").val(text);
                        searchQuery(text);

                    });
                },
                'click #footer-search-action': function () {
                  inputType.write('is-text-input');
                  inputStatus.write('is-not-listening');                  
                },
                'focus .search-text':function(){                    
                    inputType.write('is-text-input');
                    inputStatus.write('is-not-listening');
                },
                'blur .search-text':function(){
                    
                }
            }
        };
    })()
});
