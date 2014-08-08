app.defineComponent({
    name: 'browse',
    api: (function() {

        var loadStatus = new Reactive(false);
        var query = new Reactive();
        var browseProducts = new Reactive();
        var matchedCategories = new Reactive();

        function searchQuery (q) {
            Meteor.http.call("GET", "http://api.flipkart.com/InternalApi/QuickKart/search?q="+q,function(error,searchResult){
                loadStatus.write(true);                            
                browseProducts.write(searchResult.data.RESPONSE.data.products);
                matchedCategories.write(searchResult.data.RESPONSE.data.categories);                
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
                },
                matchedCategories: function () {
                    return matchedCategories.read();
                }
            },
            events: {
                'click .p-browse-item': function(event) {
                    itemId = event.currentTarget.id;                                        
                }
            },
            onRender:function(){
                var q = app.param('query');
                searchQuery(q);
                query.write(q);
            }
        };
    })()
});
