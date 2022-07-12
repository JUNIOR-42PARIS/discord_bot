export default function getRulesPage(url: string): string {
	return `
<!doctype html>
<html lang=en>

<head>
    <meta charset=utf-8>
    <title>Règlement</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Oswald">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
</head>

<style>
    html,
    body {
        margin: 0;
        height: 100%;
    }

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 5em;
        margin-left: 5em;
    }

    h1 {
        font-family: 'Oswald';
    }

    p {
        font-family: 'Open Sans';
        text-align: justify;
        width: 100%;
        max-width: 100vh;
    }

    strong {
        font-weight: bold;
    }

    .button {
        font-family: 'Open Sans';
        margin: 3em;
        margin-top: calc(3em - 16px);
        font-size: large;
        display: inline-block;
        outline: none;
        cursor: pointer;
        border-radius: 5px;
        padding: 0.5em;
        border: 0;
        color: #3a4149;
        background: #e7ebee;
        text-decoration: none;
    }

    button:hover {
        transition: all .1s ease;
        box-shadow: 0 0 0 0 #fff, 0 0 0 3px #1de9b6;
    }
</style>

<body>
    <div class="center">
        <h1>Règlement</h1>
        <p>1) <strong>Respecter les TOS et conditions d’utilisation de Discord ainsi que les lois françaises.</strong>
            Vous pouvez vous
            référer ici <a href="http://www.codes-et-lois.fr/code-civil">http://www.codes-et-lois.fr/code-civil</a> et
            <a href="https://discord.com/terms">https://discord.com/terms</a>. En effet nous avons pour
            obligation de respecter ces règles.
        </p>

        <p>2) <strong>Toutes les formes de Troll/Spam ne seront pas tolérées.</strong> Que ce soit à plusieurs échelles,
            peu importe son
            importance, un troll reste un troll. Par conséquent l’équipe de modération se chargera de vous attribuer une
            sanction en fonction de la gravité des actes commis. Nous insistons bien sur le “toutes les formes”, car les
            spams et trolls peuvent être commis de différentes manières. Junior 42 Paris s’engage à ce que tout type
            d’infractions soient jugés de la même façon.</p>

        <p>3) <strong>Garder un profil correct et SFW.</strong> (Image/Pseudo inapproprié(e) ou ne correspondant pas à
            votre login 42).
            Nous n’avons aucun droit sur le fait de vous obliger à changer l’aspect de votre profil Discord. Néanmoins,
            nous
            sommes en droit d’appliquer une sanction dans le cas où votre profil ne serait pas correct au sein de notre
            serveur. Car votre profil est visible par tous les membres de la communauté, en fonction de la sensibilité
            de
            chacun, par conséquent celui-ci peut heurter cette sensibilité là. De plus que vous les membres représentez
            notre communauté. Il est donc obligatoire que celle-ci soit correcte.
        </p>

        <p>4) <strong>Les images NSFW ne sont pas autorisées.</strong> Suite à la mise en place des conditions
            d’utilisation et du règlement
            lié aux partenaires Discord, ces dernières sont interdites au sein de notre communauté. Une communauté
            Discord
            ne contient pas forcément que de personnes majeures, il y a aussi des mineurs. Le NSFW n’a rien en
            corrélation
            avec les principes de notre communauté.</p>

        <p>5) <strong>Éviter les sujets/contenus sensibles ou à tendance polémiques ainsi que la violence
                verbale.</strong> Que ce soit tout
            ce qui est en lien avec la violence ou qui puisse heurter la sensibilités d’autrui.</p>

        <p>6) <strong>Restez positif et surtout soyez vigilant, nous sommes sur internet.</strong> En effet nous sommes
            tous derrière un
            écran, les propos haineux et les injures peuvent être facilement proférées. On vous demande donc une
            certaine
            vigilance lorsque vous êtes Discord. La positivité est synonyme de bonne humeur; notre objectif étant de
            réunir
            une communauté autour de la merveilleuse association que nous sommes la haine n'est pas la bienvenue parmi
            nous.
            Nous comprenons parfaitement que tout le monde n’a pas le même caractère, il faut donc savoir faire la part
            des
            choses.</p>

        <p>7) <strong>S'il vous plaît faites preuve de bons sens.</strong> Le spam n'est pas toléré hors du salon
            #random pour la simple
            raison que sinon des informations importantes seront noyées sous des messages sans importance.</p>

        <a class="button" href="${url}">J'accepte</a>
    </div>
</body>

</html>
`;
}