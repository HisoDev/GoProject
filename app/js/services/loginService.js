'use strict';

app.factory('loginService', function($http, $location, sessionService){
    return {
        login: function(loginInfo, $scope) {
            console.log(loginInfo)
            var $promise = $http.post('data/logginIn.php', loginInfo); //envoyer les données à logginIn.php
            $promise.then(function(msg) {
                console.log(msg.data)
                if (msg.data == 'echec') {
                    $scope.msgtxt = "Erreur de connexion."
                    //$location.path('/connexion') 
                }
                else {
                    var uid = msg.data;
                    if (uid) {
                        //scope.msgtxt = "Informations correctes."
                        sessionService.set('uid', uid)
                        $location.path('/profil')
                    }
                }
            })
        },
        logout: function(uid) {
            sessionService.destroy('uid')
            $location.path('/deco')
        },
        
        isLogged: function() {
            var $checkSessionServer = $http.post('data/check_session.php');
            return $checkSessionServer;
            
            /*if(sessionService.get('loginInfo')) 
                return true
            else
                return false*/
        }
    }
});