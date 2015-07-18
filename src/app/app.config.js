(function () {
    'use strict';

    // Define module containers
    angular.module('holyShop.services', []);
    angular.module('holyShop.directives', []);

    // App
    angular.module('holyShop', [
      'holyShop.services',
      'holyShop.directives',
      'holyShop.products',
      'holyShop.cart',

      'templates-app',
      'templates-common',
      'ui.router'
    ])

    .factory('ajaxInterceptor', ajaxInterceptor)
    .config(holyShopConfig)
    .run(holyShopRun);

    holyShopConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    holyShopRun.$inject = ['$rootScope'];
    ajaxInterceptor.$inject = ['$rootScope'];

    function holyShopConfig($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/');
        $httpProvider.interceptors.push('ajaxInterceptor');
    }

    function holyShopRun($rootScope) {

        // #region Override default alert with sweet alert
        window.alert = function () {
            var argsLength = arguments.length;

            if (argsLength == 1 && typeof (arguments[0]) !== 'object') {
                swal.call(this, arguments[0], '', 'error');
            }
            else if (argsLength == 2) {
                swal.call(this, arguments[0], arguments[1], 'error');
            }
            else {
                swal.apply(this, arguments);
            }
        };
        // #endregion

        // #region Override default confirm alert with sweet alert
        window.confirm = function (msg, fnCallback) {
            swal({
                title: 'Are you sure ?',
                text: msg,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
                closeOnConfirm: true,
                closeOnCancel: true
            }, function () {
                $rootScope.$apply(fnCallback);
            });
        };
        // #endregion
    }

    function ajaxInterceptor($rootScope) {
        var loaderInterceptor = {
            request: function (config) {
                $rootScope.ajaxInProgress = true;
                return config;
            },

            response: function (response) {
                $rootScope.ajaxInProgress = false;
                return response;
            }
        };

        return loaderInterceptor;
    }
})();

