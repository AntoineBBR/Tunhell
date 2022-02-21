<!DOCTYPE html>
<html lang="fr" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title>Login</title>
        <link rel="stylesheet" href="views/css/master.css">
    </head>
    <body>
        <header>
            <a id="logo" href="index.php">
                <img src="views/css/img/logo.png" alt="Logo du site" title="Retour à l'acceuil du site" width="150">
            </a>
            <div class="header_div">
                <a href="#">Create a game room &#10024;</a>
                <a href="#">How it works</a>
                <a href="#">Hand code &#9995;</a>
            </div>
            <div class="header_div">
                <a class="header_button" href="#">Log in</a>
                <a class="header_button" href="index.php?action=vueCreationCompte">Sign up</a>
            </div>
        </header>
        <section class="form_login_sign">
            <div class="div_login">
                <form class="form_log" action="index.php?action=login" method="POST">
                    <h1>Log-in</h1>
                    <div class ="log_field">
                        <input class="field" type="text" name="pseudo" placeholder="Pseudo" required autofocus>
                    </div>
                    <div class ="log_field">
                        <input class="field" type="password" name="password" placeholder="Password" required>
                    </div>
                    <div class ="log_field">
                        <input class="header_button" type="submit" value="Se connecter" name="subbutton">
                    </div>
                </form>
                <p>
                    Don't have an account ?
                    <a href="index.php?action=creerCompte">Sign up</a>
                </p>
            </div>
        </section>
        <footer>
                <p>Create by Imbert Antoine, Mezquita Fernandez Pedro, Blouin Lukas, Clergue Valentin, Morel Mathieu</p>
                <a href="#">Contact</a>
                <a href="#">Terms of service</a>
                <a href="#">Credits</a>
        </footer>
    </body>
</html>
