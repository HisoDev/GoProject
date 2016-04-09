<?php 
session_start();
//function getProfil() {
include("connection.php");
$data = json_decode(file_get_contents("php://input")); //obtenir les informations du formulaire
$ident = $_SESSION['ident'];
$req = "SELECT prenom,pseudo,rang,serveur FROM login WHERE identifiant = '$ident'";
$res = $db->query($req);
//$resultat = $res->fetch();
$vecteur = array();
while($resultat = $res->fetch()) {
    $vecteur[] = array(
        "prenom" => $resultat['prenom'],
        "pseudo" => $resultat['pseudo'],
        "rang" => $resultat['rang'],
        "serveur" => $resultat['serveur'],
        );
}
//print $vecteur[0];
//print "testPHP";
echo json_encode($vecteur[0]);
//return json_encode($vecteur[0]); 
//}
?>