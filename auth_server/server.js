require("dotenv").config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const axios = require("axios");
const res = require("express/lib/response");

const port = 2424;
// SSL certificate server informations
const privateKey = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var app = express();

// The endpoint for the auth. Need to pass a unique code with /auth?user=XXX
// Use the XXX in the redirect uri
app.get('/auth', function (req, res)
{
    const user_code = req.query.user_code;
    if(!user_code)
        res.status(400).send("Désolé, nous n'avons pas pu récupérer ton code unique !");
    else
        res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=85572e681d846e10b545098ab236aaa69d0b8c36cbc8b026a87e71d948045fe0&redirect_uri=https%3A%2F%2Fdamien-hubleur.tech%3A2424%2F42result?user_code=" + user_code + "&response_type=code");
});

// Then endpoint for the result of the auth. We exchange the code with a token and with it, we can access to the user's information
// We get the XXX from the URI to associate with a discord account
app.get('/42result', function (req, user_res)
{
    if(req.query.error || !req.query.code || !req.query.user_code)
    {
        console.error("Error occured during auth");
        user_res.status(400).send("Désolé, nous n'avons pas pu t'identifier !");
    }
    else
    {
        const code = req.query.code;
        const user_code = req.query.user_code;
		const params = {
            "grant_type": "authorization_code",
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "code": code,
            "redirect_uri": "https://damien-hubleur.tech:2424/42result?user_code=" + user_code
		};
        axios
		.post("https://api.intra.42.fr/oauth/token", params)
		.then(async (res) => {
            await getUserInformations(res.data.access_token, user_res)
        })
        .catch((err) => {
            console.error("Impossible to transform user's code into token:");
            console.log(err);
            user_res.status(400).send("Désolé, nous n'avons pas pu récupérer tes informations");
		});
    }
});

// Function that take the token and try to get user's informations from it
async function getUserInformations(token, user_res)
{
    const config = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };
    axios
    .get("https://api.intra.42.fr/v2/me", config)
    .then(async (res) => {
        const login = res.data.login;
        console.log(login + " logged !")
        user_res.status(200).send("Bienvenue " + login + "!");
    })
    .catch((err) => {
        console.error("Impossible to get user's informations:");
        console.log(err);
        user_res.status(400).send("Désolé, nous n'avons pas pu récupérer tes informations");
    });
}

// Creation of the https server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
	console.log('Server running on port ' + port);
});