'use strict';

//Création du contrôleur
app.controller("gameCtrl" , function($scope, plateauFactory, pierreFactory) {
        
//Création du Goban
$scope.game = new Games(pierreFactory,plateauFactory)
$scope.afficherGoban = plateauFactory.image
$scope.nbr = 0
$scope.nbGroup = 0;
$scope.groups = [];

//--------------------------------------------------------------------------------------------------------                
//Fonction qui pose une pierre blanche ou noire sur une intersection vide
$scope.posePierre = function(position) {
    console.log("Coup jouez en " + position.coordonnee.indexLigne + "," + position.coordonnee.indexCol);
    if (position.getCouleur() === "vide") {
        if ($scope.nbr%2 === 0) {
            if ($scope.compterPierre(position, "noir", 8)){
                position.setCouleur("noir");
                $scope.nbr++
            } else {
                console.log("Vous ne pouvez pas jouer là (posePierre)");
            }
        } else {
            if ($scope.compterPierre(position, "blanc", 8)){
                position.setCouleur("blanc");
                $scope.nbr++
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
    var i = position.coordonnee.indexLigne;
    var j = position.coordonnee.indexCol;

    var iVoisin;
    console.log("i : " + i + " j : " + j);
    console.log(position.voisins);

    var peutposer = false;

    // Variable pour l'utilisation des groups
    var groupPierre, iGroupPierre, groupScanneEnnemi = [], groupScanneAmi = [], groupCoor, groupMort;

    for (iVoisin = 0; iVoisin < position.voisins.length; iVoisin++) {
        var coor = position.voisins[iVoisin];
        // Si c'est une pierre adverse
        var voisin = $scope.game.getPlateau().vecteurLigne[coor.indexLigne].cols[coor.indexCol];

        if (voisin.getCouleur() === "vide") { // au moins une libertée
            console.log("On peut poser, au moins une liberté")
            peutposer = true;
        } else if (couleur !== voisin.getCouleur()) { // Le voisin est un ennemi
            // Calcul si le groupe est capturé
            console.log("On est sur un group ennemi. Cacul si capture");
            groupPierre = $scope.groups[voisin.groupIndex];
            groupMort = true;
            if (groupScanneEnnemi.indexOf(voisin.groupIndex) < 0) {
                groupScanneEnnemi.push(voisin.groupIndex);
                console.log("Calcul pour le group " + voisin.groupIndex + " qui contient " + groupPierre.length + " pierre(s)");
                console.log(groupPierre);
                for (iGroupPierre = 0; iGroupPierre < groupPierre.length && groupMort; iGroupPierre++) {
                    groupCoor = groupPierre[iGroupPierre];
                    console.log("Calcul des liberte pour coor " + groupCoor.indexLigne + "," + groupCoor.indexCol);
                    if ($scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].compterLiberte(position.coordonnee) > 0) {
                        groupMort = false;
                    }
                }
                if (groupMort) { // suppression du group et pierre peut etre posée
                    console.log("Le group " + voisin.groupIndex + " est mort");
                    for (iGroupPierre = 0; iGroupPierre < groupPierre.length; iGroupPierre++) {
                        groupCoor = groupPierre[iGroupPierre];
                        $scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].setCouleur("vide");
                    }
                    peutposer = true;
                }
            } else {
                console.log("Group " + voisin.groupIndex + " a déjà été compté");
            }
        } else if (couleur === voisin.getCouleur()) {
            console.log("On est sur un group ami");

            console.log(groupScanneAmi.indexOf(voisin.groupIndex));
            if (groupScanneAmi.indexOf(voisin.groupIndex) < 0) { // On a pas encore scanné ce group
                groupScanneAmi.push(voisin.groupIndex);
                console.log("Group Scranne ami " + voisin.groupIndex)
                groupPierre = $scope.groups[voisin.groupIndex];
                for (iGroupPierre = 0; iGroupPierre < groupPierre.length && !peutposer; iGroupPierre++) { // boucle foreach
                    groupCoor = groupPierre[iGroupPierre];
                    if ($scope.game.getPlateau().vecteurLigne[groupCoor.indexLigne].cols[groupCoor.indexCol].compterLiberte(position.coordonnee) > 0) {
                        peutposer = true
                    }
                }
            }

        } else {
            console.log("Ce cas ne peut pas arriver, puisqu'on a fait le cas oû le voisin est vide, blanc ou noir");
        }
    }


    console.log("----------------------------------------------")
    console.log($scope.groups)
    console.log(groupScanneAmi);
    console.log(groupScanneEnnemi)
    console.log("----------------------------------------------")
    if (peutposer) {
        console.log("Calcul du regroupage")
        if (groupScanneAmi.length === 0) { // creation d'un nouveau group, pas de regroupage
            position.groupIndex = $scope.groups.length;
            $scope.groups[position.groupIndex] = [] // creation de l'array du group
            $scope.groups[position.groupIndex].push(position.coordonnee); // on pourrait pusher toute la position
            $scope.nbGroup++; // A verifier si utile
            console.log("N'a pas de regroupage a faire creation d'un nouveau group " + position.groupIndex + " " + $scope.groups[position.groupIndex]);
        } else {
            console.log("Regroupage");
            var dernierGroupIndex = undefined;
            var iGroupAmi, groupAmiIndex
            for (iGroupAmi = 0; iGroupAmi < groupScanneAmi.length ; iGroupAmi++) { // boucle for each pour changer groupAmi = index Group Ami
                groupAmiIndex = groupScanneAmi[iGroupAmi];
                console.log(groupScanneAmi);
                console.log("Group Ami " + groupAmiIndex)
                console.log($scope.groups[groupAmiIndex])
                if (dernierGroupIndex === undefined) { // si le dernier group n'est pas encore défini, on le défini au group courant
                    dernierGroupIndex = groupAmiIndex;
                    position.groupIndex = dernierGroupIndex;
                    $scope.groups[dernierGroupIndex].push(position.coordonnee);
                    console.log("Attache la position " + position.coordonnee.indexLigne +","+position.coordonnee.indexCol + " au group " + dernierGroupIndex)
                } else if (dernierGroupIndex !== groupAmiIndex) { // Si on est sur un second group on doit reattribuer un nouveau numéro de group à toutes les pierres

                    for(var groupAmiCoor =0; groupAmiCoor < $scope.groups[groupAmiIndex].length; groupAmiCoor++) {
                        var positionAmi = $scope.affichagePlateau.vecteurLigne[
                            $scope.groups[groupAmiIndex][groupAmiCoor].indexLigne]
                            .cols[$scope.groups[groupAmiIndex][groupAmiCoor].indexCol];
                        positionAmi.groupIndex = dernierGroupIndex;
                        $scope.groups[dernierGroupIndex].push(positionAmi.coordonnee);
                        console.log("Reattache la position " + positionAmi.coordonnee
                            + " du group " + groupAmiIndex + " au group " + dernierGroupIndex)
                    }
                    // vide le group
                    $scope.groups[groupAmiIndex] = [];
                    console.log( $scope.groups[position.groupIndex]);
                } // Sinon le dernierGroup est le meme que le group Ami donc rien à faire
            }
            // on doit faire le regroupage
        }
    }
    return peutposer;
}
//    //var iGroup, vivant = false;
//    //for (iGroup = 0, iGroup<$scope.groups[position.groupIndex].length && !vivant; iGroup++) {
//    //    if ($scope.groups[position.groupIndex].compterLiberte() > 0) {
//    //        vivant = true;
//    //    }
//    //}
//    //
//    //if (vivant) {
//    //    // Jouer pierre
//    //} else { // delete group
//    //    for (iGroup = 0, iGroup<$scope.groups[position.groupIndex].length; iGroup++) {
//    //        $scope.groups[position.groupIndex].setCouleur("vide");
//    //    }
//    //}
//
//    if (couleur == "noir") {
//        //Test après vérification des intersections autour du coup joué.
//        if ($scope.nbrLiberties >= 1) {
//            console.log("Vous pouvez jouer. Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir = "+$scope.nbrNoir)
//            //$scope.affichagePlateau.matriceNoir[i].cols[j].valeur = $scope.nbrLiberties;
//            $scope.pierreCapturee(position,"noir");
//            return true
//        }
//        else if ($scope.nbrLiberties == 0 && $scope.nbrBlanc == 4) {
//            //Interdit sauf si les blanc autour n'ont qu'une liberté.
//            console.log("Vous avez joué à un endroit sans libertés. Coup interdit. Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir = "+$scope.nbrNoir)
//            return false
//        }
//        else if ($scope.nbrLiberties == 0 && $scope.nbrNoir >= 1) {
//            console.log("Vous pouvez jouer (Noir). Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir ="+$scope.nbrNoir)
//            //$scope.affichagePlateau.matriceNoir[i].cols[j].valeur = $scope.nbrLiberties;
//            $scope.pierreCapturee(position,"noir");
//            return true
//        }
//    }
//    else {
//        //Test après vérification des intersections autour du coup joué.
//        if ($scope.nbrLiberties >= 1) {
//            console.log("Vous pouvez jouer. Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir = "+$scope.nbrNoir)
//            //$scope.affichagePlateau.matriceBlanc[i].cols[j].valeur = $scope.nbrLiberties;
//            $scope.pierreCapturee(position,"blanc");
//            return true
//        }
//        else if ($scope.nbrLiberties == 0 && $scope.nbrNoir == 4) {
//            //Interdit sauf si les blanc autour n'ont qu'une liberté.
//            console.log("Vous avez joué à un endroit sans libertés. Coup interdit. Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir = "+$scope.nbrNoir)
//            return false
//        }
//        else if ($scope.nbrLiberties == 0 && $scope.nbrBlanc >= 1) {
//            console.log("Vous pouvez jouer (Blanc). Liberté = "+$scope.nbrLiberties+" Blanc= "+$scope.nbrBlanc+" Noir = "+$scope.nbrNoir)
//            //$scope.affichagePlateau.matriceBlanc[i].cols[j].valeur = $scope.nbrLiberties;
//            $scope.pierreCapturee(position,"blanc");
//            return true
//        }
//    }
//}

//--------------------------------------------------------------------------------------------------------
//Fonction qui va capturer toutes les pierres avec une seule liberté.
//$scope.pierreCapturee = function (position, couleur) {
//}
});


function Games(pierreFactory, plateauFactory) {
    this.id = NbrPlateau()
    this.pierreFactory = pierreFactory
    this.plateauFactory = plateauFactory
    this.coupJoue = []
    this.joueCoup = function (Coord) {
        this.coupJoue.push(Coord)
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
    
    this.save = function() {
        return angular.toJson(this.coupJoue)
    }
    
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
                this.plateau.vecteurLigne[i].cols[j] = new Position(i, j, this.pierreFactory, this.plateau);
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

function NbrPlateau() {
    var timestamp = uniqid()
    var serial = "fulguro"
    var cptPlateau = (serial + "_" + timestamp)
    return cptPlateau
}

function Position(indexLigne, indexCol, pierreFactory, plateau) {
    this.coordonnee = new Coordonnee(indexLigne, indexCol)
    this.pierreFactory = pierreFactory;
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
            this.imageEnCours = pierreFactory.image1;
        } else if (couleur === "noir") {
            this.imageEnCours = pierreFactory.image2;
        } else {
            this.imageEnCours = pierreFactory.image3;
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
            if (excepteCoor === undefined ||
                !coor.equals(excepteCoor)) {
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