app.defineComponent({
    name: 'browse',
    api: (function() {
        
        var loadStatus = new Reactive(false);
        var query = new Reactive();

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
                },
                query: function () {
                    return query.read();
                }
             
            },
            events: {
                                
            },
            onRender:function(){
                var q = app.param('query');
                searchQuery(q);
                query.write(q);
            }
        };
    })()
});
