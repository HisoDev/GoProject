'use strict'

//Mon objet Plateau
            app.factory("plateauFactory", function() {
        
                    var Goban = {
                        taillePlateau : [9,13,19],
                        coordonneesLettre : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", " "],
                        coordonneesChiffre: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
                        typeDeBois : [ "ShinKaya", "Kaya", "Chêne", "Pin", "Guymove" ],
                        image : "images/plateauFond.jpg",
                        vecteurLigne : [],

                     }
                     return Goban;
                });