<?php 
session_start();
include("connection.php");
$data = [];
//$data = json_decode(file_get_contents("php://input"));
$data = file_get_contents("php://input");
$ident = $_SESSION['ident'];
$req = "INSERT INTO parties (savePartie) VALUES ('$data')";
$res = $db->query($req);
if(!$res) {
    print "echec PHP SavePartie";
}
else {
    print "succes PHP SavePartie";
}
?>