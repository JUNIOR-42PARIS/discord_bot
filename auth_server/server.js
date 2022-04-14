require("dotenv").config();

const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
var app = express();

const axios = require("axios");
const { getToken, sleep } = require("../utils.js");

const port = 2424;

const privateKey = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/damien-hubleur.tech/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.get('/auth', function (req, res) {
    res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=85572e681d846e10b545098ab236aaa69d0b8c36cbc8b026a87e71d948045fe0&redirect_uri=https%3A%2F%2Fdamien-hubleur.tech%3A2424%2F42result?user=XXX&response_type=code");
});

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

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(2424, () => {
	console.log('Server running on port 2424');
});