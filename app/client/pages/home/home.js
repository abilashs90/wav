app.defineComponent({
    name: 'home',
    api: (function() {
        return {
            data: {                
            },
            events: {
                'click .icon-cont': function() {                    
                    app.ask('startListning', function (text) {
                        console.log(text);
                    });
                }   
            }
        };
    })()
});