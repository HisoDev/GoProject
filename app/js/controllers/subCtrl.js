'use strict';

app.controller('subCtrl', ['$scope', 'subService', function($scope, subService) {
    $scope.msgtxt = "";
    $scope.signUserUp = function(signUpInfo) {
        subService.signUserUp(signUpInfo, $scope); //appel du service pour s'inscrire.
    }
}]);