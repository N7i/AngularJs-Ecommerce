(function () {
    'use strict';

    angular
        .module('holyShop.cart')
        .controller('CartCtrl', CartController);

    CartController.$inject = ['cartStore', 'productsService'];

    function CartController(cartStore, productsService) {
        var scope = this;

        scope.getPendingOrders = cartStore.getData;

        scope.removeOne = function (pendingOrder) {
            if (pendingOrder.quantity > 0) {
                cartStore.remove(pendingOrder.product, 1);
            }
        };

        scope.addOne = function (pendingOrder) {
            cartStore.add(pendingOrder.product, 1);
        };

        scope.removeOrder = function (pendingOrder) {
            confirm('Do you realy want to remove this item from your cart ?', function (confirmed) {
                if (confirmed) {
                    cartStore.remove(pendingOrder.product, Number.MAX_VALUE);
                }
            });
        };
    }
})();
