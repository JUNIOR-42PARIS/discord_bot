require("dotenv").config();
const axios = require("axios");
const { log } = require("node:console");
const querystring = require("node:querystring");
const { client } = require("./main.js");

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
	validateAuth: async (discordUserId, user) => {
		//todo: const groups = user.groups
		//todo: Tuteur ? Staff ? Bocal ?
		//todo: rename <name> (login)

		const guild = await client.guilds.fetch("953954460047147008");
		const member = await guild.members.fetch(discordUserId);

		const bocal = user["staff?"];
		const tuteur = user.groups.find((g) => g.id == 40);

		try {
			await member.setNickname(`${user.first_name} (${user.login})`);
			if (bocal) await member.roles.add("960464782132142151");
			if (tuteur) await member.roles.add("960464388177940540");
		} catch (err) {
			console.error(err);
		}
	},
};
