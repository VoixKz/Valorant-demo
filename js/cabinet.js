var app = angular.module('indexApp', []);

app.controller('CabinetController', function($scope) {
    $scope.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!$scope.currentUser) {
        window.location.href = 'login.html';
    }

    $scope.changePassword = function() {
        $scope.passwordError = '';
        if ($scope.newPassword === $scope.confirmPassword) {
            var users = JSON.parse(localStorage.getItem('users')) || [];
            var user = users.find(u => u.email === $scope.currentUser.email);
            if (user) {
                user.password = $scope.newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Пароль успешно изменен');
                $scope.newPassword = '';
                $scope.confirmPassword = '';
            } else {
                alert('Пользователь не найден');
            }
        } else {
            $scope.passwordError = 'Пароли не совпадают';
        }
    };

    $scope.logout = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
});