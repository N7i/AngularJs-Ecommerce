(function() {
    'use strict';

    angular
        .module('holyShop.products')
        .controller('ProductsCtrl', ProductController);

    ProductController.$inejct = ['cartStore', 'productsService'];

    function ProductController(cartStore, productsService) {
        var scope = this;

        angular.extend(scope, {
            books: [],
            store: cartStore
        });

        productsService.getData()
            .then(function success(httpResult) {
                scope.books = httpResult.data;
            });
    }

})();

