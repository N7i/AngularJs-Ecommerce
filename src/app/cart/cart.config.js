(function () {
    'use strict';

    angular
        .module('holyShop.cart', [
            'ui.router'
        ])
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('cart', {
            url: '/panier',
            views: {
                main: {
                    controller: 'CartCtrl as cart',
                    templateUrl: 'cart/cart.tpl.html'
                }
            },
            data: { pageTitle: 'Your Cart' }
        });
    }
})();
