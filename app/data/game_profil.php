<?php 
session_start();
//function getProfil() {
include("connection.php");
$data = json_decode(file_get_contents("php://input")); //obtenir les informations du formulaire
$ident = $_SESSION['ident'];
$req = "SELECT joueurBlanc,joueurNoir FROM parties WHERE identifiant = '$ident'";
$res = $db->query($req);
//$resultat = $res->fetch();


echo json_encode($nbr);
?>