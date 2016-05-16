<?php 
session_start();
//function recharge() {
include("connection.php");
$data = json_decode(file_get_contents("php://input")); //obtenir les informations du formulaire
$ident = $_SESSION['ident'];
$req = "SELECT joueurBlanc, datePartie, savePartie FROM parties WHERE joueurBlanc = '$ident'";
$res = $db->query($req);
//$resultat = $res->fetch();
$vecteur = array();
while($resultat = $res->fetch()) {
    $vecteur[] = array(
        "joueurBlanc" => $resultat['joueurBlanc'],
        "datePartie" => $resultat['datePartie'],
        "savePartie" => $resultat['savePartie'],
        );
}

echo $json_game = json_encode($vecteur);
?>