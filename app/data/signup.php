<?php 
    $data = json_decode(file_get_contents("php://input"));
    $returnValue = strlen($data->pwd);
    if ($returnValue > 3)
        print "succes";
    else {
        print "error";
    }
?>