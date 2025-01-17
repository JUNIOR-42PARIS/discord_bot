import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import http from 'http';
import { readEnv } from './utils';
import type { Client } from 'discord.js';
import { SavedUser, users } from '.';
import { ObjectId } from 'mongodb';
import getRulesPage from './rules';

const client42 = readEnv('CLIENT_ID_42');
var secret42 = readEnv('SECRET_42');
const roleId = readEnv('VERIFIED_ROLE');
const redirect_uri = readEnv('SERVER_URL');
const lambda_url = readEnv('LAMBDA_URL');
const lambda_secret = readEnv('LAMBDA_SECRET');

// Function that take the token and try to get user's informations from it
async function validateUser(access_token: string, user: SavedUser, client: Client): Promise<string> {
	const resp = await axios.get('https://api.intra.42.fr/v2/me', {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const guild = await client.guilds.fetch(user.guid);
	const member = await guild.members.fetch(user.uid);

	// const bocal = user["staff?"];
	// const tuteur = user.groups.find((g) => g.id == 40);

	// if (bocal) await member.roles.add("960464782132142151");
	// if (tuteur) await member.roles.add("960464388177940540");
	await member.roles.add(roleId);
	await member.setNickname(`${resp.data.usual_first_name || resp.data.first_name} (${resp.data.login})`);
	
	return resp.data.login as string;
}

export function startApp(client: Client): http.Server {
	const app = express();

	// The endpoint for the auth. Need to pass a unique code with /auth?user=XXX
	// Use the XXX in the redirect uri
	app.get('/', async function (req, res) {
		try {
			const user_code = req.query.c;
			if (typeof user_code != 'string')
				throw new Error('Malformed request');
			if (await users.countDocuments({ _id: new ObjectId(user_code) }) == 0)
				throw new Error('Could not find user');
			res.send(getRulesPage(`/verify?c=${user_code}`));
		} catch {
			res
				.status(400)
				.send('Bad request');
		}
	});

	// Then endpoint for the result of the auth. We exchange the code with a token and with it, we can access to the user's information
	// We get the XXX from the URI to associate with a discord account
	app.get('/42result', async function (req, user_res) {
		try {
			await validateApiKey();
			const code = req.query.code;
			const user_code = req.query.c;
			if (req.query.error || typeof user_code != 'string')
				throw new Error('Malformed request');
			const user = await users.findOneAndDelete({ _id: new ObjectId(user_code) });
			if (!user.ok || !user.value)
				throw new Error('Could not find user');
			const params = {
				grant_type: 'authorization_code',
				client_id: client42,
				client_secret: secret42,
				code,
				redirect_uri: `${redirect_uri}/42result?c=${user_code}`,
			};
			const resp = await axios.post('https://api.intra.42.fr/oauth/token', params);
			const login = await validateUser(
				resp.data.access_token,
				user.value,
				client
			);
			const guild = await client.guilds.fetch(user.value.guid);
			const member = await guild.members.fetch(user.value.uid);
			await member.roles.add(roleId);
			console.log(`${login} logged in !`);
			user_res.status(200).send(`Bienvenue ${login}, tu peux maintenant fermer cet onglet !`);
		} catch (err: any) {
			console.error(err);
			user_res
				.status(400)
				.send('Désolé, nous n\'avons pas pu récupérer tes informations');
		}
	});

	app.get('/verify', async (req, res) => {
		try {
			const user_code = req.query.c;
			if (typeof user_code != 'string')
				throw new Error('Malformed request');
			const user = await users.findOne({ _id: new ObjectId(user_code) });
			if (!user)
				throw new Error('Could not find user');
			const url = new URL('https://api.intra.42.fr/oauth/authorize');
			url.searchParams.append('client_id', client42);
			url.searchParams.append('redirect_uri', `${redirect_uri}/42result?c=${user_code}`);
			url.searchParams.append('response_type', 'code');
			res.redirect(url.toString());
		} catch {
			res
				.status(400)
				.send('Bad request');
		}
	});

	const httpServer = http.createServer(app);
	return httpServer;
}

async function validateApiKey() {
	try {
		await axios.post(`https://api.intra.42.fr/oauth/token?grant_type=client_credentials&client_id=${client42}&client_secret=${secret42}`);
	} catch {
		console.log('Fetching new token...');
		const resp = await axios.get(lambda_url, { headers: { Authorization: lambda_secret } });
		secret42 = resp.data;
		console.log('Successfully fetched new token !');
	}
}
