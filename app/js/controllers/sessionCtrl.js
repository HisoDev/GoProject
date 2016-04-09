'use strict';

app.controller('sessionCtrl', ['$scope','loginService', function($scope, loginService) {
    $scope.logout = function() {
        loginService.logout()
    }
}]);