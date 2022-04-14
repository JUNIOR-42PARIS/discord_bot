require("dotenv").config();
const axios = require("axios");
const { log } = require("node:console");
const querystring = require("node:querystring");

const { generateUniqueCode, addToStore } = require("auth_server/server.js");

module.exports = {
	getToken: async () => {
		const headersList = {
			Accept: "*/*",
			"Content-Type": "application/x-www-form-urlencoded",
		};
		const bodyContent = querystring.stringify({
			grant_type: "client_credentials",
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
		});

		const reqOptions = {
			url: "https://api.intra.42.fr/oauth/token",
			method: "POST",
			headers: headersList,
			data: bodyContent,
		};

		const token = await axios
			.request(reqOptions)
			.then((response) => {
				return response.data.access_token;
			})
			.catch((err) => {
				console.log(err);
				return NULL;
			});

		return token;
	},
	sleep: (ms) => new Promise((res) => setTimeout(res, ms)),
	initAuth: (discordUserId) => {
		const code = generateUniqueCode();
		addToStore(code, discordUserId);
		const url = "https://damien-hubleur.tech:2424/auth?user_code=" + code;
		return url;
	},
	validateAuth: (discordUserId, user) => {
		// Saky
		// Return rien
	}
};
