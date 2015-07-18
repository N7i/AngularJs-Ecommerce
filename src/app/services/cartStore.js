(function () {
    'use strict';

    angular
        .module('holyShop.services')
        .service('cartStore', cartStore);

    cartStore.$inject = ['$q', 'productsService'];

    function cartStore($q, productsService) {
        var _pendingsOrders = [],
            _lastCommercialOfferDeferred = null,
            _price = {
                original: 0,
                offer: 0,
                offerInPercent: 0,
                hasOffer: false
            };

        return {
            getData: getData,
            add: add,
            remove: remove,
            removeById: removeById,
            contains: contains,
            getCount: getCount,
            getPrice: getPriceSync
        };

        function getData() {
            return _pendingsOrders;
        }

        function add(product, qt) {
            var quantity = qt || 1,
                existingPendingOrder = findOrderByProduct(product);

            if (null !== existingPendingOrder) {
                existingPendingOrder.quantity += quantity;
            }
            else {
                _pendingsOrders.push({
                    product: product,
                    quantity: quantity
                });
            }

            computeStorePriceAsync();
        }

        function remove(product, qt) {
            var quantity = qt || 1;

            removeById(product.isbn, quantity);
        }

        function removeById(pid, qt) {
            var quantity = qt || 1,
                order = findOrderByProductId(pid);

            if (null !== order) {
                if (order.quantity - qt < 0) {
                    _pendingsOrders = _pendingsOrders.filter(function (item) {
                        return item.product.isbn !== pid;
                    });
                }
                else {
                    order.quantity -= qt;
                }

                computeStorePriceAsync();
            }
        }

        function findOrderByProduct(product) {
            return findOrderByProductId(product.isbn);
        }

        function findOrderByProductId(pid) {
            for (var i = 0; i < _pendingsOrders.length; ++i) {
                var order = _pendingsOrders[i];

                if (order.product.isbn === pid) {
                    return order;
                }
            }
            return null;
        }

        function contains(product) {
            for (var i = 0; i < _pendingsOrders.length; ++i) {
                var order = _pendingsOrders[i];

                if (order.product.isbn === product.isbn) {
                    return order.quantity;
                }
            }
            return 0;
        }

        function getCount() {
            var counter = 0;

            _pendingsOrders.forEach(function computeOrderCountInCart(order) {
                counter += order.quantity;
            });

            return counter;
        }

        function getPriceSync() {
            return _price;
        }

        function computeStorePriceAsync() {
            var originalPrice = 0;

            _pendingsOrders.forEach(function computeOrderOriginalPrice(order) {
                originalPrice += order.product.price * order.quantity;
            });

            getCommercialOfferPrice(originalPrice)
                .then(function success(result) {
                    angular.extend(_price, result);
                });
        }

        function getCommercialOfferPrice(originalPrice) {
            if (null !== _lastCommercialOfferDeferred) {
                _lastCommercialOfferDeferred.reject('canceled');
            }

            var defered = $q.defer(),
                productsIds = _pendingsOrders.map(
                    function findProductsId(order) {
                        if (order.quantity > 0) {
                            return order.product.isbn;
                        }
                    }).filter(
                    function removeEmptyProductId(id) {
                        return id;
                    });

            if (productsIds.length > 0) {
                productsService.getCommercialOffersFor(productsIds)
                    .then(function (httpResult) {
                        var offers = httpResult.data.offers;

                        defered.resolve(
                            findBestCommercialOffer(
                                originalPrice,
                                offers
                            )
                        );
                    },
                    function (reason) {
                        defered.reject(reason);
                    });
            }
            else {
                defered.resolve(
                    findBestCommercialOffer(originalPrice, []));
            }

            _lastCommercialOfferDeferred = defered;
            return defered.promise;
        }

        function findBestCommercialOffer(originalPrice, offers) {
            var offerStrategiesHolder = {
                minus: computeMinusOfferStategy,
                slice: computeSliceOfferStategy,
                percentage: computePercentOfferStrategy
            },
            bestPriceOffer = originalPrice;

            offers.forEach(function (offer) {
                if (offerStrategiesHolder[offer.type]) {
                    var priceOffer = offerStrategiesHolder[offer.type](originalPrice, offer);
                    if (priceOffer < bestPriceOffer) {
                        bestPriceOffer = priceOffer;
                    }
                }
                else {
                    console.error('Unknown stategy for offer type ' + offer.type);
                }
            });

            if (bestPriceOffer !== originalPrice) {
                return {
                    original: originalPrice,
                    hasOffer: true,
                    offer: Math.round(bestPriceOffer),
                    // TODO Hell floating point ....
                    percent: Math.floor( ((originalPrice - bestPriceOffer) / originalPrice * 100) + 0.00000012 )
                };
            }
            else {
                return {
                    original: originalPrice,
                    hasOffer: false,
                    offer: 0,
                    percent: 0
                };
            }
        }

        function computeSliceOfferStategy(price, offer) {
            return price - Math.floor(price / offer.sliceValue) * offer.value;
        }

        function computeMinusOfferStategy(price, offer) {
            return price - offer.value;
        }

        function computePercentOfferStrategy(price, offer) {
            return price - price * offer.value / 100;
        }
    }
})();