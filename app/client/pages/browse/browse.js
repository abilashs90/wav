app.defineComponent({
    name: 'browse',
    api: (function() {

        var loadStatus = new Reactive(false);

        function searchQuery (q) {
            Meteor.http.call("GET", "http://api.flipkart.com/InternalApi/QuickKart/search?q="+q,function(searchResult,error){
                loadStatus.write(true);
                console.log(searchResult,error);
            });
        }

        return {
            data: {
                loadStatus: function(){
                    return loadStatus.read();
                }

            },
            events: {

            },
            onRender:function(){
                var query = app.param('query');
                searchQuery(query);

            }
        };
    })()
});
