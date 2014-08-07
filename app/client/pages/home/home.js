app.defineComponent({
    name: 'home',
    api: (function() {
        return {
            data: {                
            },
            events: {
                'click .p-home-icon-cont': function() {                    
                    $(".p-input-big-keyboard").removeClass("invisible");
                    app.ask('startListning', function (text) {
                        this.$(".search-text").val(text);
                    });
                },
                'click #footer-search-action': function () { 
                   $(".p-input-big-keyboard").removeClass("invisible");       
                   $(".search-text").focus();
                   $("#footer-search-action").addClass("invisible");
                },
                'focus .search-text':function(){
                    $("#footer-search-action").addClass("invisible");
                },
                'blur .search-text':function(){
                    $("#footer-search-action").removeClass("invisible")
                }    
            }
        };
    })()
});