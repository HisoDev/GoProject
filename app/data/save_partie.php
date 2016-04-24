<?php 
session_start();
include("connection.php");
//$data = json_decode(file_get_contents("php://input"));
$data = [];
$data = file_get_contents("php://input");
$_SESSION['id_game'] = uniqid('fgame_');
$joueurBlanc = "blanc";
$joueurNoir = "noir";
$etat = "1"; //partie fini en 1, en cours à 0
$savePartie = $data;
$ident = $_SESSION['ident'];
$req = "INSERT INTO parties (joueurBlanc, joueurNoir, nom_Partie, etat, savePartie) VALUES ('$ident','$joueurNoir','$_SESSION[id_game]','$etat','$savePartie')";
$res = $db->query($req);
if(!$res) {
    print "echec PHP SavePartie";
}
else {
    print "succes PHP SavePartie";
}
?>