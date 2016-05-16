<?php 
session_start();
include("connection.php");
$ident = $_SESSION['ident'];
$requete = "SELECT prenom, pseudo, rang, serveur FROM login WHERE identifiant = '$ident'";
$resultat = $db->query($requete); //or die ('Erreur'.$req.''.mysql_error());

$data = json_decode(file_get_contents("php://input"));

if($data->prenom != "") {
    $prenom = $data->prenom;
}
else {
    $prenom = $resultat['prenom'];
}
if($data->pseudo != "") {
    $pseudo = $data->pseudo;
}
else {
    $pseudo = $resultat['pseudo'];
}
if($data->rang != "") {
    $rang = $data->rang;
}
else {
    $rang = $resultat['rang'];
}
if($data->serveur != "") {
    $serveur = $data->serveur;
}
else {
    $serveur = $resultat['serveur'];
}

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