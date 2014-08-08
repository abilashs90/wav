app.defineComponent({
    name: 'browse',
    api: (function() {

        var loadStatus = new Reactive(false);
        var query = new Reactive();
        var browseProducts = new Reactive();

        function searchQuery (q) {
            Meteor.http.call("GET", "http://api.flipkart.com/InternalApi/QuickKart/search?q="+q,function(error,searchResult){
                loadStatus.write(true);
                console.log(searchResult);
                console.log(searchResult.data.RESPONSE);
                browseProducts.write(searchResult.data.RESPONSE.data.products);
                console.log(browseProducts);
            });
        }

        return {
            data: {
                loadStatus: function(){
                    return loadStatus.read();
                },
                query: function () {
                    return query.read();
                },
                browseProducts:function(){
                    return browseProducts.read();
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
