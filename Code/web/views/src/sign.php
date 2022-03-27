<html class="h-full p-0 m-0" lang="fr" dir="ltr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TunHell - Sign Up</title>
        <link href="views/dist/output.css" rel="stylesheet">
        <link rel="shortcut icon" type="image/png" href="views/rsc/favicon.png">
	</head>
    <body class="bg-slate-200 flex flex-col font-Montserrat h-full m-0 p-0">
        <?php require_once("header.php") ?>
        <section class="main flex flex-col h-full justify-center items-center">
            <div class="flex mb-5">
                <div class="hidden lg:flex">
                    <img class="h-96 w-96 2xl:h-32 2xl:w-32 object-cover rounded-l-lg" src="views/rsc/dragon_compress.jpg" alt="">
                </div>
                <form class ="bg-white rounded-r-lg flex flex-col items-center justify-center h-96 w-96 2xl:h-32 2xl:w-32 2xl:gap-y-1" action="index.php?action=signup" method="POST">
                    <h1 class="text-2xl font-bold">Create Account</h1>
                    <label for="pseudo" class="mt-3 text-xs">Pseudo : </label>
                    <input name="pseudo" type="text">
                    <label for="password" class="mt-3 text-xs">Password : </label>
                    <input name="password" type="password">
                    <label for="confirmpassword" class="mt-3 text-xs">Password again : </label>
                    <input name="confirmpassword" type="password">
                    <input class="btn bg-blue-700 mt-6" type="submit" value="Register">
                    <p class="mt-2">
                        Already have an account ?
                        <a href="index.php?action=viewLog">Log in</a>
                    </p>
                </form>
            </div>
            <?php
                if(isset($empty_password) && $empty_password == true){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-semibold text-white">Le mot de passe ne peut pas être vide</p>
                            </div>';
                }
                if(isset($invalid_password) && $invalid_password == true){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p class="font-semibold text-white">
                                            Le mots de passe doit avoir :<br>
                                            • 8 à 20 caractères<br>
                                            • Une lettre minuscule et une lettre majuscule<br>
                                            • Un chiffre<br>
                                            • Un de ces caractères spéciaux: $ @ % * + - _ !</p>
                            </div>';
                }
                if(isset($empty_username) && $empty_username == true){
                    echo '<div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-semibold text-white">Le pseudo ne peut pas être vide</p>
                            </div>';
                }
                if(isset($invalid_username) && $invalid_username == true){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-semibold text-white">Le pseudo doit contenir entre 1 et 25 charactères</p>
                            </div>';
                }
                if(isset($err) && $err == "err auth"){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-medium text-white">Erreur lors de la création du compte, veuillez recommencer</p>
                            </div>';
                }
                if(isset($w_cpassword) && $w_cpassword == true){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-medium text-white">Le mot de passe de confirmation ne correspond pas</p>
                            </div>';
                }
                if(isset($exist_username) && $exist_username == true){
                    echo '  <div class="bg-red-500 rounded-lg p-2 flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="font-medium text-white">Le nom est déjà existant</p>
                            </div>';
                }
            ?>
        </section>
        <?php require_once("footer.php") ?>
    </body>
</html>