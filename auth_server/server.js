require("dotenv").config();

const fs = require("fs");
const express = require("express");
const axios = require("axios");
const https = require("https");

const { readDB, writeDB } = require("../utils.js");
const { guildId } = require("../config.json");

var credentials;
// SSL certificate server informations
try {
	const privateKey = fs.readFileSync(
		"/etc/letsencrypt/live/damien-hubleur.tech/privkey.pem",
		"utf8"
	);
	const certificate = fs.readFileSync(
		"/etc/letsencrypt/live/damien-hubleur.tech/cert.pem",
		"utf8"
	);
	const ca = fs.readFileSync(
		"/etc/letsencrypt/live/damien-hubleur.tech/chain.pem",
		"utf8"
	);
	credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca,
	};
} catch (err) {
	console.error(err);
}

// Function that take the token and try to get user's informations from it
async function getUserInformations(token, user_res, user_code, client) {
	const config = {
		headers: {
			Authorization: "Bearer " + token,
		},
	};
	axios
		.get("https://api.intra.42.fr/v2/me", config)
		.then(async (res) => {
			const db = readDB("./auth_server/users.json");
			console.log(res.data.login + " logged !");
			const found = db.find((o) => o.code === user_code);
			validateAuth(found.id, res.data, client);
			// db.splice(found, 1);
			// writeDB("./users.json", db);
			user_res.status(200).send("Bienvenue " + res.data.login + "!");
		})
		.catch((err) => {
			console.error("Impossible to get user's informations:");
			console.log(err);
			user_res
				.status(400)
				.send("Désolé, nous n'avons pas pu récupérer tes informations");
		});
}

async function validateAuth(discordUserId, user, client) {
	//todo: const groups = user.groups,
	//todo: Tuteur ? Staff ? Bocal ?
	//todo: rename <name> (login)

	const guild = await client.guilds.fetch(guildId);
	const member = await guild.members.fetch(discordUserId);

	const bocal = user["staff?"];
	const tuteur = user.groups.find((g) => g.id == 40);

	try {
		await member.setNickname(`${user.first_name} (${user.login})`);
		if (bocal) await member.roles.add("960464782132142151");
		if (tuteur) await member.roles.add("960464388177940540");
		await member.roles.add("954063445634985984");
		console.log(`${user.login} is set up`);
	} catch (err) {
		console.error(err);
	}
}

function startApp(client) {
	let app = express();

	// The endpoint for the auth. Need to pass a unique code with /auth?user=XXX
	// Use the XXX in the redirect uri
	app.get("/auth", function (req, res) {
		const db = readDB("./auth_server/users.json");
		const user_code = req.query.user_code;
		const found = db.some((o) => o.code === user_code);
		if (!user_code || !found)
			res
				.status(400)
				.send(
					"Désolé, nous n'avons pas pu récupérer ton code unique ! https://s.42l.fr/results"
				);
		else
			res.redirect(
				"https://api.intra.42.fr/oauth/authorize?client_id=85572e681d846e10b545098ab236aaa69d0b8c36cbc8b026a87e71d948045fe0&redirect_uri=https%3A%2F%2Fdamien-hubleur.tech%3A2424%2F42result?user_code=" +
					user_code +
					"&response_type=code"
			);
	});

	// Then endpoint for the result of the auth. We exchange the code with a token and with it, we can access to the user's information
	// We get the XXX from the URI to associate with a discord account
	app.get("/42result", function (req, user_res) {
		if (req.query.error || !req.query.code || !req.query.user_code) {
			console.error("Error occured during auth");
			user_res.status(400).send("Désolé, nous n'avons pas pu t'identifier !");
		} else {
			const db = readDB("./auth_server/users.json");
			const code = req.query.code;
			const user_code = req.query.user_code;
			const found = db.some((o) => o.code === user_code);
			if (!found)
				user_res
					.status(400)
					.send(
						"Désolé, nous n'avons pas pu récupérer ton code unique ! https://s.42l.fr/results"
					);
			const params = {
				grant_type: "authorization_code",
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET,
				code: code,
				redirect_uri:
					"https://damien-hubleur.tech:2424/42result?user_code=" + user_code,
			};
			axios
				.post("https://api.intra.42.fr/oauth/token", params)
				.then(async (res) => {
					await getUserInformations(
						res.data.access_token,
						user_res,
						user_code,
						client
					);
				})
				.catch((err) => {
					console.error("Impossible to transform user's code into token:");
					console.log(err);
					user_res
						.status(400)
						.send(
							"Désolé, nous n'avons pas pu récupérer tes informations : https://s.42l.fr/results"
						);
				});
		}
	});

	const httpsServer = https.createServer(credentials, app);
	return httpsServer;
}
module.exports = { startApp };
