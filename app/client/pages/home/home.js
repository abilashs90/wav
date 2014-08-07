app.defineComponent({
    name: 'home',
    api: (function() {
        return {
            data: {                
            },
            events: {
                'click .icon-cont': function() {                    
                    $(".p-input-big-keyboard").removeClass("invisible");
                    app.ask('startListning', function (text) {
                        this.$(".search-text").val(text);
                    });
                }   
            }
        };
    })()
});