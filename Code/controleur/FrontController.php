<?php
class FrontController{

    function __construct(){
        $listeActions_Visiteur = array("creerCompte", "connection", "reinit");

        try{
            isset($_REQUEST['action'])  ?  $action = Validation::validateString($_REQUEST['action'])  :  $action = "reinit";
            if (in_array($action, $listeActions_Visiteur)){
                $ctrV = new ViewController();
            }
        }
        catch(Exception $e){
            //gestion des erreurs
        }

    }



}
