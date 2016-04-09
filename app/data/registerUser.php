<?php 
include('connection.php');
$data = json_decode(file_get_contents("php://input"));
$user = $data->identifiant;
$pwd = $data->pwd;
//print "Je suis dans RegisterPHP";
$req = "INSERT INTO login (identifiant,password,prenom,pseudo,rang,serveur) VALUES ('$user', '$pwd','Vide','Vide','X','X')";
$res = $db->query($req); //or die ('Erreur'.$req.''.mysql_error());
if(!$res) {
    print "echec";
}
else {
    print "succes";
}
//echo json_encode($user);
?>