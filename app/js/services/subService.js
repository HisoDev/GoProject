'use strict';

app.factory('subService', function($http, $location){
        return {
            signUserUp: function(signUpInfo, $scope) {
                console.log(signUpInfo)
                var $promise = $http.post('data/signup.php', signUpInfo); //tester les données à signup.php
                $promise.then(function(msg) {
                    if (msg.data == 'succes') {
                        //$scope.msgtxt = "Informations correctes."
                        var $promise2 = $http.post('data/registerUser.php', signUpInfo);
                        $promise2.then(function(msg2) {
                            if (msg2.data == 'succes') {
                                console.log("register succes")
                            }
                            else
                                console.log("register echec")
                        })
                        $location.path('/accueil')
                    }
                    else {
                        console.log(msg.data+" echec")
                        $scope.msgtxt = "Informations incorrectes."
                        $location.path('/inscription')
                    }
                })
            }
        }
});