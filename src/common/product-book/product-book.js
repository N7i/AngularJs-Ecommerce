(function() {
    'use strict';

    angular
        .module('holyShop.directives')
        .directive('productBook', productBook);

    function productBook () {
        return {
            scope: {
                book: "=",
                store: "="
            },
            link: link,
            restrict: 'EA',
            templateUrl: 'product-book/product-book.tpl.html'
        };

        function link(scope) {
            scope.pushProtuctToCart = function (product) {
                scope.store.add(product);
            };

            scope.isProductInStore = function (product) {
                return scope.store.contains(product);
            };
        }
    }

})();