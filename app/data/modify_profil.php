<?php 
session_start();
include("connection.php");
$data = json_decode(file_get_contents("php://input"));
$ident = $_SESSION['ident'];
$prenom = $data->prenom;
$pseudo = $data->pseudo;
$rang = $data->rang;
$serveur = $data->serveur;
//print "Je suis dans RegisterPHP";
$req = "UPDATE login SET prenom = '$prenom', pseudo = '$pseudo', rang = '$rang', serveur = '$serveur' WHERE identifiant = '$ident'";
$res = $db->query($req); //or die ('Erreur'.$req.''.mysql_error());
if(!$res) {
    print "echec";
}
else {
    print "succes";
}

?>