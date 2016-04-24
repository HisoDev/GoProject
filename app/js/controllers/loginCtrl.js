'use strict';

//Contrôleur qui va permettre de gérer les connexions
app.controller("loginCtrl", ['$scope', '$http', '$location', '$route', 'loginService', function($scope, $http, $location, $route, loginService) {
    $scope.msgtxt = "";
    $scope.bonjour = "";
    
    $scope.login = function(loginInfo) {
        loginService.login(loginInfo, $scope); //appel du service pour se logger.
        
    };
    
    $scope.profils = function() {
        var $promise = $http.post("data/check_profil.php")
        $promise.then(function(msg) {
            console.log(msg.data['serveur'])
            var msgPromise = msg.data
            console.log(msgPromise['pseudo'])
            var profilUser = {
                pseudo: msgPromise['pseudo'],
                rang: msgPromise['rang'],
                serveur: msgPromise['serveur']
            };
            console.log(profilUser['rang'])
            if (msg.data) {
                console.log("success")
                $scope.infos = msgPromise
                
            }
            else {
                console.log("echec")
            }
        })
    };
    $scope.infos = $scope.profils()
    
    //Modification des données personnelles
    $scope.modifyP = function(modifyProfil) {
        var $promise = $http.post("data/modify_profil.php", modifyProfil)
        $promise.then(function(msg) {
            if (msg.data == "succes") {
                alert("Modifications réussies")
                $location.path('/accueil')
            }
            else
                $scope.modif = "Modifications échouées"
        })
    }
}]);