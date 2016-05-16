'use strict';

//Création du contrôleur
app.controller("gameCtrl", ['$scope', '$http', '$location', 'plateauFactory', 'pierreFactory', function($scope, $http, $location, plateauFactory, pierreFactory) {
        
//Création du Goban
$scope.game = new Games(pierreFactory,plateauFactory)
$scope.afficherGoban = plateauFactory.image
$scope.nbr = 0
$scope.nbrPC = 0
$scope.nbGroup = 0
$scope.groups = []
$scope.couleur = 0
$scope.totCapture = 0


//Créer une partie
/*$scope.create = function () {
    var $promise = $http.post("data/create_partie.php", )
    $promise.then(function(msg) {
        console.log(msg.data)
        
    })
}*/



//--------------------------------------------------------------------------------------------------------                
//Fonction qui pose une pierre blanche ou noire sur une intersection vide
$scope.posePierre = function(position) {
    console.log("Coup joué en " + position.coordonnee.indexLigne + "," + position.coordonnee.indexCol);
    if (position.getCouleur() === "vide") {
        if ($scope.nbr%2 === 0) {
            if ($scope.compterPierre(position, "noir", 8)){
                position.setCouleur("noir");
                $scope.game.joueCoup(position.coordonnee.toString())
                $scope.nbr++
                console.log($scope.game.coupJoue)
            } else {
                console.log("Vous ne pouvez pas jouer là (posePierre)");
            }
        } else {
            if ($scope.compterPierre(position, "blanc", 8)){
                position.setCouleur("blanc");
                $scope.game.joueCoup(position.coordonnee.toString())
                $scope.nbr++
                console.log($scope.game.coupJoue)
            } else {
                console.log("Vous ne pouvez pas jouer là (posePierre)");
            }
        }

    }

}
                
//--------------------------------------------------------------------------------------------------------
//Fonction qui compte les libertés et qui détermine les pierres autour.
$scope.compterPierre = function(position, couleur, taille) {
    $scope.nbrLiberties = 0
    $scope.nbrBlanc = 0
    $scope.nbrNoir = 0
    //Check les libertés d'une pierre jouée.
    //intersection à gauche
    var i = position.coordonnee.indexLigne
    var j = position.coordonnee.indexCol

    var iVoisin;
    console.log("i : " + i + " j : " + j)
    console.log(position.voisins); // Donne les 4 libertés de la pierre jouée

    var peutposer = false

    // Variable pour l'utilisation des groups
    var groupPierre, iGroupPierre, groupScanneEnnemi = [], groupScanneAmi = [], groupCoor, groupMort

    for (iVoisin = 0; iVoisin < position.voisins.length; iVoisin++) {
        var coor = position.voisins[iVoisin]
        // Si c'est une pierre adverse
        var voisin = $scope.game.getPlateau().vecteurLigne[coor.indexLigne].cols[coor.indexCol]

        if (voisin.getCouleur() === "vide") { // au moins une libertée
            console.log("On peut poser, au moins une liberté")
            peutposer = true
        } else if (couleur !== voisin.getCouleur()) { // Le voisin est un ennemi
            // Calcul si le groupe est capturé
            console.log("On est sur un group ennemi. Calcul si capture")
            groupPierre = $scope.groups[voisin.groupIndex]
            groupMort = true
            if (groupScanneEnnemi.indexOf(voisin.groupIndex) < 0) {
                groupScanneEnnemi.push(voisin.groupIndex)
                console.log("Calcul pour le group " + voisin.groupIndex + " qui contient " + groupPierre.length + " pierre(s)");
                console.log(groupPierre);
                for (iGroupPierre = 0; iGroupPierre < groupPierre.length && groupMort; iGroupPierre++) {
                    groupCoor = groupPierre[iGroupPierre]
                    console.log("Calcul des libertes pour coor " + groupCoor.indexLigne + "," + groupCoor.indexCol)
                    if ($scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].compterLiberte(position.coordonnee) > 0) {
                        groupMort = false
                    }
                }
                if (groupMort) { // suppression du group et pierre peut etre posée
                    console.log("Le group " + voisin.groupIndex + " est mort")
                    for (iGroupPierre = 0; iGroupPierre < groupPierre.length; iGroupPierre++) {
                        groupCoor = groupPierre[iGroupPierre]
                        $scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].setCouleur("vide")
                    }
                    peutposer = true
                }
            } else {
                console.log("Group " + voisin.groupIndex + " a déjà été compté")
            }
        } else if (couleur === voisin.getCouleur()) {
            console.log("On est sur un group ami")

            console.log(groupScanneAmi.indexOf(voisin.groupIndex))
            if (groupScanneAmi.indexOf(voisin.groupIndex) < 0) { // On a pas encore scanné ce group
                groupScanneAmi.push(voisin.groupIndex)
                console.log("Group Scranne ami " + voisin.groupIndex)
                groupPierre = $scope.groups[voisin.groupIndex]
                for (iGroupPierre = 0; iGroupPierre < groupPierre.length && !peutposer; iGroupPierre++) { // boucle foreach
                    groupCoor = groupPierre[iGroupPierre]
                    if ($scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].compterLiberte(position.coordonnee) > 0) {
                        peutposer = true
                    }
                }
            }

        } else {
            console.log("Ce cas ne peut pas arriver, puisqu'on a fait le cas oû le voisin est vide, blanc ou noir")
        }
    }


    console.log("----------------------------------------------")
    console.log($scope.groups)
    console.log(groupScanneAmi)
    console.log(groupScanneEnnemi)
    console.log("----------------------------------------------")
    if (peutposer) {
        console.log("Calcul du regroupage")
        if (groupScanneAmi.length === 0) { // creation d'un nouveau group, pas de regroupage
            position.groupIndex = $scope.groups.length
            $scope.groups[position.groupIndex] = [] // creation de l'array du group
            $scope.groups[position.groupIndex].push(position.coordonnee) // on pourrait pusher toute la position
            $scope.nbGroup++ // A verifier si utile
            console.log("N'a pas de regroupage à faire creation d'un nouveau group " + position.groupIndex + " " + $scope.groups[position.groupIndex])
        } else {
            console.log("Regroupage")
            var dernierGroupIndex = undefined
            var iGroupAmi, groupAmiIndex
            for (iGroupAmi = 0; iGroupAmi < groupScanneAmi.length ; iGroupAmi++) { // boucle for each pour changer groupAmi = index Group Ami
                groupAmiIndex = groupScanneAmi[iGroupAmi]
                console.log(groupScanneAmi)
                console.log("Group Ami " + groupAmiIndex)
                console.log($scope.groups[groupAmiIndex])
                if (dernierGroupIndex === undefined) { // si le dernier group n'est pas encore défini, on le défini au group courant
                    dernierGroupIndex = groupAmiIndex
                    position.groupIndex = dernierGroupIndex
                    $scope.groups[dernierGroupIndex].push(position.coordonnee)
                    console.log("Attache la position " + position.coordonnee.indexLigne +","+position.coordonnee.indexCol + " au group " + dernierGroupIndex)
                } else if (dernierGroupIndex !== groupAmiIndex) { // Si on est sur un second group on doit reattribuer un nouveau numéro de group à toutes les pierres

                    for (var groupAmiCoor = 0; groupAmiCoor < $scope.groups[groupAmiIndex].length; groupAmiCoor++) {
                        var positionAmi = $scope.game.getPlateau().vecteurLigne[
                            $scope.groups[groupAmiIndex][groupAmiCoor].indexLigne]
                            .cols[$scope.groups[groupAmiIndex][groupAmiCoor].indexCol]
                        positionAmi.groupIndex = dernierGroupIndex
                        $scope.groups[dernierGroupIndex].push(positionAmi.coordonnee)
                        console.log("Reattache la position " + positionAmi.coordonnee
                            + " du group " + groupAmiIndex + " au group " + dernierGroupIndex)
                    }
                    // vide le group
                    $scope.groups[groupAmiIndex] = []
                    console.log( $scope.groups[position.groupIndex])
                } // Sinon le dernierGroup est le meme que le group Ami donc rien à faire
            }
            // on doit faire le regroupage
        }
    }
    return peutposer;
}
//-----------------------------------
//Sauver une partie quand elle a été jouée
$scope.saveGame = function() {
    var savePartie
    $scope.game.save = angular.toJson($scope.game.coupJoue)
    console.log($scope.game.coupJoue)
    console.log($scope.game.id)
    console.log($scope.game.save)
    var $promise = $http.post("data/save_partie.php", $scope.game.save)
    $promise.then(function(msg) {
        console.log(msg.data)
        if (msg.data == "succes PHP SavePartie") {
            console.log("Succes Save Partie")
            alert("La partie est finie, elle a été enregistrée ! ")
            $location.path('/menu')
        }
        else {
            console.log("Echec Save Partie")
        }
    })
}
//-----------------------------------
//Aller chercher les parties du joueur dans la base de données
$scope.recharge = function() {
    var $promise = $http.post("data/recharge_game.php")
    $promise.then(function(msg) {
        console.log(msg.data)
        var partie = msg.data
        if (msg.data) {
            console.log("recharge succes")
            $scope.parties = partie
            angular.fromJson(partie.savePartie)
            console.log(partie.savePartie)
        }
        else
            console.log("recharge error")
    })
}
$scope.parties = $scope.recharge()
this.partieChoisie = []
//-----------------------------------
//recup coordonnée de la partie jouée
$scope.recupCoor = function(i) {
    console.log(i + "dans recupCoor")
    var indexLigne = $scope.partieChoisie[i]
    var indexCol = $scope.partieChoisie[i+2]
    if ($scope.partieChoisie[i] == null) {
        alert("La partie est finie")
        $location.path('/profil')
    }
    else {
        console.log($scope.partieChoisie)
        return $scope.game.getPlateau().vecteurLigne[indexLigne].cols[indexCol]
    }
}

//-----------------------------------
//Charger la partie dans review
$scope.chargerPartie = function (vectorGame) {
    $scope.show = true
    console.log(this)
    console.log(vectorGame)
    $scope.partieChoisie = vectorGame
    console.log($scope.partieChoisie + "dans chargerPartie")
}

$scope.avancer = function() {
    var i = 2+($scope.nbrPC*6)
    var coord
    console.log(this)
    console.log(i + "dans avancer")
    console.log($scope.partieChoisie + "dans avancer")
    coord = $scope.recupCoor(i)
    console.log(coord + " dans avancer")
    $scope.posePierre(coord)
    $scope.nbrPC++
}
}]);


function Games(pierreFactory, plateauFactory) {
    this.id = nbrPlateau()
    this.pierreFactory = pierreFactory
    this.plateauFactory = plateauFactory
    this.coupJoue = []
    this.joueCoup = function (Coord) {
        this.coupJoue.push(Coord)
    }
    this.couleur = 0
    this.makeCouleur = function (couleur) {
        this.couleur = couleur
    }
    this.etat = false //début de partie => false | fin de partie => true
    this.nbrCoup = 0
    this.plateau = {}
    this.etatPartie = []
    this.detailPartie = function(joueurA, joueurB, etat) {
        this.etatPartie.push(id, joueurA, joueurB, etat, this.coupJoue)
        this.etatPartie.push(joueurA)
        this.etatPartie.push(joueurB)
        this.etatPartie.push(etat)
        this.etatPartie.push(this.coupJoue)
        return this.etatPartie
    }
    
    this.save /*= function() {
        return angular.toJson(this.coupJoue)
    }*/
    
    this.charge = function(partie) {
        this.coupJoue = angular.fromJson(partie)
    }
    
    this.getPlateau = function() {
        return this.plateau
    }
    this.plateau.vecteurLigne = []
    var taille = 0;
    var i,j;
    if (taille == 0) {
        this.plateau.groups = [];
        for (i=0;i<this.plateauFactory.taillePlateau[taille];i++) {
            this.plateau.vecteurLigne[i] = {}
            this.plateau.vecteurLigne[i].cols = []
            for (j=0;j<this.plateauFactory.taillePlateau[taille];j++) {
                this.plateau.vecteurLigne[i].cols[j] = new Position(i, j, this.pierreFactory, this.plateau)
            }
        }
    }
}


function uniqid() {
    var ts=String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=2) {        
       out+=Number(ts.substr(i, 2)).toString(36);    
    }
    return ('d'+out)
}      

function nbrPlateau() {
    var timestamp = uniqid()
    var serial = "fulguro"
    var cptPlateau = (serial + "_" + timestamp)
    return cptPlateau
}


function Position(indexLigne, indexCol, pierreFactory, plateau) {
    this.coordonnee = new Coordonnee(indexLigne, indexCol)
    this.pierreFactory = pierreFactory;
    /*if(this.coordonnee.indexLigne == 0 && this.coordonnee.cols == 0)
        this.imageEnCours = pierreFactory.coin3
    if(this.coordonnee.indexLigne == 8 && this.coordonnee.cols == 8)
        this.imageEnCours = pierreFactory.coin2
    if(this.coordonnee.indexLigne == 0 && this.coordonnee.cols == 8)
        this.imageEnCours = pierreFactory.coin1
    if(this.coordonnee.indexLigne == 8 && this.coordonnee.cols == 0)
        this.imageEnCours = pierreFactory.coin4
    if(this.coordonnee.indexLigne == 0)
        this.imageEnCours = pierreFactory.bord4
    if(this.coordonnee.indexLigne == 8)
        this.imageEnCours = pierreFactory.bord1
    if(this.coordonnee.indexCol == 0)
        this.imageEnCours = pierreFactory.bord3
    if(this.coordonnee.indexCol == 8)
        this.imageEnCours = pierreFactory.bord2
    else
        this.imageEnCours = pierreFactory.image3*/
    this.imageEnCours = pierreFactory.image3;
    this.plateau = plateau;
    this.groupIndex = undefined;

    this.getCouleur = function() {
        if (this.imageEnCours === pierreFactory.image1) {
            return "blanc";
        }
        if (this.imageEnCours === pierreFactory.image2) {
            return "noir";
        }
        return "vide";
    }
    this.setCouleur = function(couleur) {
        if (couleur === "blanc") {
            this.imageEnCours = pierreFactory.image1
        } else if (couleur === "noir") {
            this.imageEnCours = pierreFactory.image2
        } else {
            /*if(this.coordonnee.indexLigne == 0 && this.coordonnee.cols == 0)
                this.imageEnCours = pierreFactory.coin3
            if(this.coordonnee.indexLigne == 8 && this.coordonnee.cols == 8)
                this.imageEnCours = pierreFactory.coin2
            if(this.coordonnee.indexLigne == 0 && this.coordonnee.cols == 8)
                this.imageEnCours = pierreFactory.coin1
            if(this.coordonnee.indexLigne == 8 && this.coordonnee.cols == 0)
                this.imageEnCours = pierreFactory.coin4
            if(this.coordonnee.indexLigne == 0)
                this.imageEnCours = pierreFactory.bord4
            if(this.coordonnee.indexLigne == 8)
                this.imageEnCours = pierreFactory.bord1
            if(this.coordonnee.indexCol == 0)
                this.imageEnCours = pierreFactory.bord3
            if(this.coordonnee.indexCol == 8)
                this.imageEnCours = pierreFactory.bord2*/
            /*else
                this.imageEnCours = pierreFactory.image3*/
                
            this.imageEnCours = pierreFactory.image3
        }
    }

    this.voisins = [];
    if (this.coordonnee.indexLigne == 0) {
        this.voisins.push(new Coordonnee(this.coordonnee.indexLigne+1, this.coordonnee.indexCol));
        if (this.coordonnee.indexCol == 0) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
        } else if (this.coordonnee.indexCol == 8) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol-1));
        } else {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol-1));
        }
    } else if (this.coordonnee.indexLigne == 8) {
        this.voisins.push(new Coordonnee(this.coordonnee.indexLigne-1, this.coordonnee.indexCol));
        if (this.coordonnee.indexCol == 0) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
        } else if (this.coordonnee.indexCol == 8) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol-1));
        } else {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne,this.coordonnee. indexCol-1));
        }
    } else {
        this.voisins.push(new Coordonnee(this.coordonnee.indexLigne+1, this.coordonnee.indexCol));
        this.voisins.push(new Coordonnee(this.coordonnee.indexLigne-1, this.coordonnee.indexCol));
        if (this.coordonnee.indexCol == 0) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
        } else if (this.coordonnee.indexCol == 8) {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol-1));
        } else {
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol+1));
            this.voisins.push(new Coordonnee(this.coordonnee.indexLigne, this.coordonnee.indexCol-1));
        }
    }

    this.compterLiberte = function(excepteCoor) {
        var liberte = 0, iVoisin = 0;
        console.log("Compte liberté");
        for (iVoisin = 0; iVoisin < this.voisins.length; iVoisin++) {
            var coor = this.voisins[iVoisin];
            if (excepteCoor === undefined || !coor.equals(excepteCoor)) {
                console.log("Voisin " + coor.indexLigne + "," + coor.indexCol +
                    " Couleur " + this.plateau.vecteurLigne[coor.indexLigne]
                        .cols[coor.indexCol].getCouleur());
                if (this.plateau.vecteurLigne[coor.indexLigne]
                        .cols[coor.indexCol].getCouleur() === "vide") {
                    liberte++;
                }
            } else {
                console.log("On ignore la coor " + excepteCoor)
            }
        }
        console.log("Coor " + this.coordonnee.indexLigne +","+ this.coordonnee.indexCol+ " a " + liberte + " liberte");
        return liberte;
    }
}

function Coordonnee(indexLigne, indexCol) {
    this.indexLigne = indexLigne;
    this.indexCol = indexCol;

    this.equals = function(otherCoor) {
        return this.indexLigne === otherCoor.indexLigne && this.indexCol === otherCoor.indexCol;
    }

    this.toString = function() {
        return this.indexLigne + "," + this.indexCol;
    }
}