'use strict';

app.service('gameService', function(pierreFactory, plateauFactory) {
    
        this.position= function(indexLigne, indexCol, pierreFactory, plateauFactory) {
            this.coordonnee = new Coordonnee(indexLigne, indexCol)
            this.pierreFactory = pierreFactory;
            this.imageEnCours = pierreFactory.image3;
            this.plateauFactory = plateauFactory;
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
                            " Couleur " + this.plateauFactory.vecteurLigne[coor.indexLigne]
                                .cols[coor.indexCol].getCouleur());
                        if (this.plateauFactory.vecteurLigne[coor.indexLigne]
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
        },

        this.coordonnee= function(indexLigne, indexCol) {
            this.indexLigne = indexLigne;
            this.indexCol = indexCol;

            this.equals = function(otherCoor) {
                return this.indexLigne === otherCoor.indexLigne && this.indexCol === otherCoor.indexCol;
            }

            this.toString = function() {
                return this.indexLigne + "," + this.indexCol;
            }
        }
    
});