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
                },
                'click #footer-search-action': function () { 
                   $('#footer-search-action .main-action').toggleClass("invisible");
                   $('#main-search-action .main-action').toggle("invisible");
                }   
            }
        };
    })()
});