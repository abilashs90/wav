app.defineComponent({
    name: 'browse',
    api: (function() {

        var loadStatus = new Reactive(false);
        var query = new Reactive();
        var browseProducts = new Reactive();
        var matchedCategories = new Reactive();
        var loadListStatus = new Reactive(false);
        var productDetails = new Reactive();

        function searchUrl(url){
            mainUrl = "http://api.flipkart.com"+url;
            Meteor.http.call("GET",mainUrl ,function(error,searchResult){
                loadListStatus.write(true);            
                browseProducts.write(searchResult.data.RESPONSE.data.products);             
            });
        }
        function searchQuery (q) {
            var url = "http://api.flipkart.com/InternalApi/QuickKart/search?q="+q;
            Meteor.http.call("GET",url ,function(error,searchResult){
                loadStatus.write(true);  
                loadListStatus.write(true);                          
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
                },
                currentCategory:function(){
                    return currentCategory.read();
                },
                loadListStatus:function(){
                    return loadListStatus.read();
                },
                productDetails: function () {
                    return productDetails.read();
                }
            },
            events: {
                'click .p-browse-item': function(event) {
                    var itemId = event.currentTarget.id;           
                    $(".overlay").show();                             
                    console.log(this);
                    productDetails.write(this);
                },
                'click .p-browse-category':function(event){
                    loadListStatus.write(false);
                    $currTar = $(event.currentTarget);
                    url = $currTar.attr("data-url");
                    $(".p-active-category").removeClass("p-active-category");
                    $currTar.addClass("p-active-category");
                    searchUrl(url);
                },
                'click .cancel-query':function(event){
                    app.action('redirect','home');
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
