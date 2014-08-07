app.defineComponent({
    name: 'home',
    api: (function() {
        var inputType = new Reactive('is-voice-input'),
            inputStatus = new Reactive('is-not-listening'),
            inputText = new Reactive();

        return {
            data: {
              inputType: function() {
                return inputType.read();
              },
              inputStatus: function() {
                return inputStatus.read();
              },
              inputText: function() {
                return inputText.read();
              }
            },
            events: {
                'click .p-home-icon-cont': function() {
                    inputText.write("");
                    inputType.write('is-voice-input');
                    inputStatus.write('is-listening');
                    app.ask('startListning', function (text) {
                        inputStatus.write('is-finished-listening');
                        this.$(".search-text").val(text);
                        setTimeout(function () {
                            app.action('redirect', "browse", {query: text});
                        }, 1000);                        
                    }, function (text) {
                        inputText.write(text);
                    });
                },
                'click #footer-search-action': function () {
                  inputType.write('is-text-input');
                  inputStatus.write('is-not-listening');
                },
                'focus .search-text':function(){
                    inputType.write('is-text-input');
                    inputStatus.write('is-not-listening');
                }
            }
        };
    })()
});
