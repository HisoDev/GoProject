/* global angular */
'use strict';

var app = angular.module('GoProject', ['ngRoute']);
            //--------------------------------------------------------------------------------------------------------            
            //Configuration du routing
            app.config(function($routeProvider) {
                $routeProvider
                .when('/', { templateUrl: 'views/partials/index.html'})
                .when('/accueil', { 
                    controller: 'sessionCtrl',
                    templateUrl: 'views/partials/index.html'})
                .when('/profil', { 
                    controller: 'loginCtrl',
                    templateUrl: 'views/partials/profil.html'})
                .when('/connexion', { 
                    controller: 'loginCtrl',
                    templateUrl: 'views/partials/connexion.html'})
                .when('/inscription', { 
                    controller: 'subCtrl',
                    templateUrl: 'views/partials/inscription.html'})
                .when('/affichePartie', { 
                    controller: 'gameCtrl',
                    templateUrl: 'views/partials/affichePartie.html'})
                .when('/menu', { 
                    controller: 'gameCtrl',
                    templateUrl: 'views/partials/menuJouer.html'})
                .when('/jouer', { 
                    controller: 'gameCtrl',
                    templateUrl: 'views/partials/jouer.html'})
                .when('/forum', { templateUrl: 'views/partials/forum.html'})
                .when('/contact', { templateUrl: 'views/partials/contact.html'})
                .when('/liens', { templateUrl: 'views/partials/liens.html'})
                .when('/deco', { 
                    controller: 'sessionCtrl',
                    templateUrl: 'views/partials/logout.html'})
                .otherwise({redirectTo: '/'})
            });
            
app.run(function($rootScope, $location, loginService) {
    var routesPermission = ['/menu'] //Pour jouer, il doit être connecté
    $rootScope.$on('$routeChangeStart', function() {
        if(routesPermission.indexOf($location.path()) !=-1) {
            var connected = loginService.isLogged();
            connected.then(function(msg) {
                if(!msg.data)
                    $location.path('/connexion')
            })
        }
    })
    var routesPermissionCo = ['/profil'] //Pour aller sur le profil, il doit être connecté
    $rootScope.$on('$routeChangeStart', function() {
        if(routesPermissionCo.indexOf($location.path()) !=-1) {
            var connected = loginService.isLogged();
            connected.then(function(msg) {
                if(!msg.data)
                    $location.path('/connexion')
            })
        }
    })
    var routesPermissionPJ = ['/affichePartie'] //Pour aller sur partie jouée, il doit être connecté
    $rootScope.$on('$routeChangeStart', function() {
        if(routesPermissionPJ.indexOf($location.path()) !=-1) {
            var connected = loginService.isLogged();
            connected.then(function(msg) {
                if(!msg.data)
                    $location.path('/connexion')
            })
        }
    })
});