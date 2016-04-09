<?php 
    include("connection.php");
    $data = json_decode(file_get_contents("php://input")); //obtenir les informations du formulaire
    $ident = $data->identifiant;
    $pass = $data->pwd;
    $req = "SELECT identifiant,password FROM login WHERE identifiant = '$ident'";
    $res = $db->query($req); //or die ('Erreur'.$req.''.mysql_error());
    $resultat = $res->fetch();
    if(!$resultat) {
        print "echec";
    }
    else {
    
    //Vérification de l'identifiant et du mot de passe
        if ($ident == $resultat['identifiant'] && $pass == $resultat['password']) {
        //Si le mail et le mot de passe sont corrects, 
        //une session commence avec comme uid (identificateur temporaire de la session de la personne),
        //commencera avec fulguro_PlusUneSérieDeChiffre
            session_start();
            $_SESSION['uid'] = uniqid('fulguro_');
            $_SESSION['ident'] = $resultat['identifiant'];
            print $_SESSION['uid'];
        }
        else {
            print "echec";
        }
    }
    
?>