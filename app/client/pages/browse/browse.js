app.defineComponent({
    name: 'browse',
    api: (function() {
        

        function searchQuery (q) {
            Meteor.http.call("GET", "http://api.flipkart.com/InternalApi/QuickKart/search?q="+q,function(searchResult,error){
                console.log(searchResult,error);
            });           
        }

        return {
            data: {
             
            },
            events: {
                
            },
            onRender:function(){
                var query = app.param('query');
                console.log(query);
                searchQuery(query);
            }
        };
    })()
});
