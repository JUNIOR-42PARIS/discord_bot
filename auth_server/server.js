require("dotenv").config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const axios = require("axios");
const { getToken, sleep } = require("../utils.js");

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
app.get('/auth', function (req, res) {
    res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=85572e681d846e10b545098ab236aaa69d0b8c36cbc8b026a87e71d948045fe0&redirect_uri=https%3A%2F%2Fdamien-hubleur.tech%3A2424%2F42result?user=XXX&response_type=code");
});

// Then endpoint for the result of the auth. We exchange the code with a token and with it, we can access to the user's information
// We get the XXX from the URI to associate with a discord account
app.get('/42result', function (req, res) {
    if(req.query.error)
        res.status(200).send("Désolé, nous n'avons pas pu t'identifier !");
    else
    {
        const code = req.query.code;
        const user = req.query.user;
		const params = {
            "grant_type": "authorization_code",
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "code": code,
            "redirect_uri": "https://damien-hubleur.tech:2424/42result?user=" + user
		};
        axios
			.post("https://api.intra.42.fr/oauth/token", params)
			.then(async (res) => {
                console.log(res.data);
            })
            .catch((err) => {
                    console.log(err);
			});
        res.status(200).send("Bienvenue " + user + "!");
    }
});

// Creation of the https server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(2424, () => {
	console.log('Server running on port 2424');
});