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
                'click .p-input-big-camera':function(){
                    $(".confirmPic").show();
                    $("#video").addClass("p-cap-vid");
                    app.ask('capturePic',function(text){
                        console.log(text);
                    });
                },
                'click .confirmPic':function(){
                    $("#video").addClass("invisible");
                    $("#canvas").addClass("p-cap-vid");
                    $(".confirmPic").hide();
                     app.ask('getCapturedPic',function(text){
                        console.log(text);
                        Meteor.http.post("http://api.flipkart.com/InternalApi/QuickKart/getUrl",{params:{"png":text}},function(err,succ){
                            console.log(err,succ);
                            $("#video").hide();                            
                            $("#canvas").hide();
                            app.action("redirect","recognize",{"url":"http"});
                        });
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
