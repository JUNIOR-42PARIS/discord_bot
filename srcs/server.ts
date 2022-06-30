require("dotenv").config();

import express from "express";
import axios from "axios";
import http from "http";
import { readEnv } from "./utils";
import type { Client } from "discord.js";
import { SavedUser, users } from ".";
import { ObjectId } from "mongodb";

const client42 = readEnv("42_CLIENT_ID");
const secret42 = readEnv("42_SECRET");
const roleId = readEnv("VERIFIED_ROLE");

// Function that take the token and try to get user's informations from it
async function validateUser(access_token: string, user: SavedUser, client: Client): Promise<string> {
	const resp = await axios.get("https://api.intra.42.fr/v2/me", {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	})
	const guild = await client.guilds.fetch(user.guid);
	const member = await guild.members.fetch(user.uid);

	// const bocal = user["staff?"];
	// const tuteur = user.groups.find((g) => g.id == 40);

	await member.setNickname(`${resp.data.usual_first_name || resp.data.first_name} (${resp.data.login})`);
	// if (bocal) await member.roles.add("960464782132142151");
	// if (tuteur) await member.roles.add("960464388177940540");
	await member.roles.add(roleId);

	return resp.data.login as string;
}

export function startApp(client: Client) {
	let app = express();

	// The endpoint for the auth. Need to pass a unique code with /auth?user=XXX
	// Use the XXX in the redirect uri
	app.get("/", async function (req, res) {
		const user_code = req.query.c;
		const guild_id = req.query.g;
		if (typeof user_code != "string" || typeof guild_id != "string")
			return;
		const user = await users.findOne(new ObjectId(user_code));
		if (user)
			res.redirect(
				`https://api.intra.42.fr/oauth/authorize?client_id=${client42}&redirect_uri=https%3A%2F%2Fauth.bde42.me%2F42result?c=${user_code}&response_type=code`
			);
		else
			res
				.status(400)
				.send(
					"Désolé, nous n'avons pas pu récupérer ton code unique ! https://s.42l.fr/results"
				);
	});

	// Then endpoint for the result of the auth. We exchange the code with a token and with it, we can access to the user's information
	// We get the XXX from the URI to associate with a discord account
	app.get("/42result", async function (req, user_res) {
		try {
			const code = req.query.code;
			const user_code = req.query.c;
			const guild_id = req.query.g;
			if (req.query.error || typeof user_code != "string" || typeof guild_id != "string")
				throw new Error("Malformed request");
			const user = await users.findOneAndDelete(new ObjectId(user_code));
			if (!user.ok || !user.value) {
				throw new Error("Could not find user");
			}
			const params = {
				grant_type: "authorization_code",
				client_id: client42,
				client_secret: secret42,
				code,
				redirect_uri: `https://auth.bde42.me/42result?user_code=${user_code}`,
			};
			const resp = await axios.post("https://api.intra.42.fr/oauth/token", params)
			const login = await validateUser(
				resp.data.access_token,
				user.value,
				client
			);
			console.log(`${login} logged in !`);
		} catch (err: any) {
			console.error(err);
			user_res
				.status(400)
				.send(
					"Désolé, nous n'avons pas pu récupérer tes informations : https://s.42l.fr/results"
				);
		}
	});

	const httpServer = http.createServer(app);
	return httpServer;
}
