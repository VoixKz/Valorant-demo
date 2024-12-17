var app = angular.module('myApp', []);

app.controller('AuthController', function($scope) {
    $scope.register = function() {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var existingUser = users.find(u => u.email === $scope.email);

        if (existingUser) {
            alert('Пользователь с таким email уже существует');
            return;
        }

        var user = {
            email: $scope.email,
            password: $scope.password
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Регистрация успешна');
        window.location.href = 'login.html';
    };

    $scope.login = function() {
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var user = users.find(u => u.email === $scope.email && u.password === $scope.password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Вход успешен');
            window.location.href = 'index.html';
        } else {
            alert('Неверный email или пароль');
        }
    };
});