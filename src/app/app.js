(function () {
    'use strict';

    angular
        .module('holyShop')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope', 'cartStore'];

    function AppCtrl($scope, cartStore) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | Holy Shop';
            }
        });

        Object.defineProperty(
            $scope,
            'productsInCartCount', {
                get: function () {
                    return cartStore.getCount();
                }
            }
        );

        Object.defineProperty(
            $scope,
            'productsInCartPrice', {
                get: function () {
                    return cartStore.getPrice();
                }
            }
        );
    }
})();

