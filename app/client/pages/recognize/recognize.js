app.defineComponent({
    name: 'recognize',
    api: (function() {

        var loadStatus = new Reactive(false);
        var categories = new Reactive();

        function searchQuery (q) {
            var url = "http://api.flipkart.com/InternalApi/QuickKart/recognize?url=http%3A%2F%2Fblog.jimdo.com%2Fwp-content%2Fuploads%2F2014%2F01%2Ftree-247122.jpg";
            Meteor.http.call("GET",url ,function(error,searchResult){
                loadStatus.write(true);
                console.log(searchResult); 
                var tmpA = [];
                console.log(Object.keys(searchResult.data.RESPONSE.data.list));
                Object.keys(searchResult.data.RESPONSE.data.list).forEach(function(e,i,a){
                    tmpO = {"title":e};
                    tmpO.subCategory = [];                   
                    var tmpB = searchResult.data.RESPONSE.data.list[e];
                    tmpB.forEach(function(ei,i,a){
                        tmpO.subCategory.push({"title":ei});

                    });
                    tmpA.push(tmpO);
                });
                console.log(tmpA);
                categories.write(tmpA);
                console.log(categories.read());

            });
        }

        return {
            data: {
                loadStatus: function(){
                    return loadStatus.read();
                },
                categories:function(){
                    return categories.read();
                }
           
            },
            events: {
               
            },
            onRender:function(){
                var q = app.param('url');
                searchQuery(q);
            }
        };
    })()
});
