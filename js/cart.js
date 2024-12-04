var app = angular.module('cartApp', []);

app.controller('CartController', function($scope) {
    $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!$scope.currentUser) {
        window.location.href = 'login.html';
    }

    $scope.cart = JSON.parse(localStorage.getItem('cart_' + $scope.currentUser.email)) || [];

    $scope.updateCartDisplay = function() {
        $scope.cart = JSON.parse(localStorage.getItem('cart_' + $scope.currentUser.email)) || [];
    };

    $scope.increaseCount = function(productId) {
        const cartItem = $scope.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.count += 1;
            localStorage.setItem('cart_' + $scope.currentUser.email, JSON.stringify($scope.cart));
            $scope.updateCartDisplay();
        }
    };

    $scope.decreaseCount = function(productId) {
        const cartItem = $scope.cart.find(item => item.id === productId);
        if (cartItem && cartItem.count > 1) {
            cartItem.count -= 1;
            localStorage.setItem('cart_' + $scope.currentUser.email, JSON.stringify($scope.cart));
            $scope.updateCartDisplay();
        } else if (cartItem && cartItem.count === 1) {
            $scope.removeItem(productId);
        }
    };

    $scope.removeItem = function(productId) {
        $scope.cart = $scope.cart.filter(item => item.id !== productId);
        localStorage.setItem('cart_' + $scope.currentUser.email, JSON.stringify($scope.cart));
        $scope.updateCartDisplay();
    };

    $scope.clearCart = function() {
        $scope.cart = [];
        localStorage.setItem('cart_' + $scope.currentUser.email, JSON.stringify($scope.cart));
        $scope.updateCartDisplay();
    };

    $scope.submitOrder = function() {
        const totalPrice = $scope.cart.reduce((acc, item) => acc + item.price * item.count, 0); 
        alert('Order submitted. Total price: ' + totalPrice);
        $scope.clearCart();
    };

    $scope.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };

    $scope.updateCartDisplay();
});