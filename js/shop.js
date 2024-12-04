var app = angular.module('shopApp', []);

app.controller('ShopController', function($scope, $http) {
    $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    $scope.items = [];
    $scope.categories = [];
    $scope.sortKey = 'name';
    $scope.reverse = false; 
    $scope.searchText = ''; 
    $scope.selectedCategory = ''; 

    if (!$scope.currentUser) {
        window.location.href = 'login.html';
    }

    $http.get('https://valorant-api.com/v1/weapons')
        .then(function(response) {
            if (response.data.data && Array.isArray(response.data.data)) {
                const categoriesSet = new Set();
                $scope.items = response.data.data.map(function(weapon) {
                    if (weapon.shopData && weapon.shopData.category) {
                        categoriesSet.add(weapon.shopData.category);
                    }
                    return {
                        id: weapon.uuid,
                        name: weapon.displayName,
                        price: weapon.shopData ? weapon.shopData.cost : 'N/A',
                        icon: weapon.displayIcon,
                        category: weapon.shopData ? weapon.shopData.category : 'Uncategorized'
                    };
                });
                $scope.categories = Array.from(categoriesSet);
            } else {
                console.error('Unexpected data format:', response.data);
            }
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });

    $scope.addToCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('cart_' + $scope.currentUser.email)) || [];
        const product = $scope.items.find(element => element.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.count += 1;
            $scope.showAddToCartMessage(product.name, cartItem.count, false);
        } else {
            cart.push({...product, count: 1});
            $scope.showAddToCartMessage(product.name, 1, true);
        }
        localStorage.setItem('cart_' + $scope.currentUser.email, JSON.stringify(cart));
    };

    $scope.showAddToCartMessage = function(productName, count, isNew) {
        const message = document.createElement('div');
        message.className = 'toast';
        message.innerHTML = `
            <div class="toast-body">
                ${productName} ${isNew ? 'добавлен в корзину' : 'количество увеличено до'} ${count}
            </div>
        `;

        document.body.appendChild(message);
        setTimeout(() => {
            message.classList.add('show');
        }, 100);

        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    };

    $scope.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
});