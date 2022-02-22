<?php

class VisiteurController{

    public function __construct($action){
        //variables globales
        global $rep, $vues;
        //tableau des messages d'erreur

        try{
            switch ($action){

                case "viewAcceuil":
                    $this->viewAcceuil();
                    break;

                case "viewSign":
                    $this->vueCreationCompte();
                    break;

                case "viewLog":
                    $this->vueConnection();
                    break;

                case "login":
                    $this->login();
                    break;

                default:
                    //gestion d'erreurs
                    break;
            }
        }
        catch(Exception $e){
            $tabErreur[] = $e->getMessage();
            require ($rep.$vues['error']);
        }
        catch(PDOException $e){
            $tabErreur[] = $e->getMessage();
            require ($rep.$vues['error']);
        }

        exit(0);
    }

    function viewAcceuil(){
        global $rep, $vues;
        //vue principale
        if(isset($_SESSION)) print_r($_SESSION);
        if(isset($isLogin)) print_r($isLogin);
        require ($rep.$vues['acceuil']);
    }

    function viewSign(){
        global $rep, $vues;
        //vue creation compte
        require ($rep.$vues['sign']);
    }

    function viewLog(){
        global $rep, $vues;
        //vue connection
        require ($rep.$vues['login']);
    }

    function login(){
        global $rep, $vues;

        $mdlAccount = new ModelVisiteur();
        $utilisateur = $mdlAccount->logUser();

        if($utilisateur == null)
        {
            $isLogin = 0;
            $tabErreur = ["Le pseudo ou le mot de passe est incorrect !"];
            require ($rep.$vues['error']);
        }
        else
        {
            $isLogin = 1;
            new VisiteurController("afficherAcceuil");
        }
    }


}
