(function () {
    'use strict';

    angular
        .module('holyShop.services')
        .factory('productsService', productsService);

    productsService.$inject = ['$http'];

    function productsService($http) {
        return {
            getData: getData,
            getCommercialOffersFor: getCommercialOffersFor
        };

        function getData() {
            return $http({
                method: 'GET',
                url: '//henri-potier.xebia.fr/books'
            });
        }

        function getCommercialOffersFor(productsId) {
            return $http({
                method: 'GET',
                url: '//henri-potier.xebia.fr/books/'+ productsId.join(',') +'/commercialOffers'
            });
        }
    }
})();

//vinai.jerely@gmail.com