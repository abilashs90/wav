app.defineComponent({
    name: 'product',
    api: (function() {

        function getProduct (id) {
            Meteor.http.call("GET", "http://w3-internal-api.vip.nm.flipkart.com/InternalApi/ProductService/getProductDetailsInfo?ids="+id,function(error,jsonResult){
                console.log(jsonResult);
            });
        }

        return {
            data: {

            },
            events: {
               
            },
            onRender:function(){
                var id = app.param('id');
                getProduct(q);
            }
        };
    })()
});
