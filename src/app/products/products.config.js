(function() {
    'use strict';

    angular
        .module('holyShop.products', [
            'ui.router'
        ])
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider.state('products', {
            url: '/',
            views: {
                main: {
                    controller: 'ProductsCtrl as products',
                    templateUrl: 'products/products.tpl.html'
                }
            },
            data: { pageTitle: 'Products' }
        });
    }
})();

