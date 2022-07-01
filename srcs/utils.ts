import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import querystring from 'node:querystring';

export async function getToken(): Promise<string> {
	const headersList = {
		Accept: '*/*',
		'Content-Type': 'application/x-www-form-urlencoded',
	};
	const bodyContent = querystring.stringify({
		grant_type: 'client_credentials',
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
	});

	const reqOptions: AxiosRequestConfig = {
		url: 'https://api.intra.42.fr/oauth/token',
		method: 'POST',
		headers: headersList,
		data: bodyContent,
	};

	const response = await axios.request(reqOptions);
		
	return response.data.access_token;
}

export async function sleep(ms: number): Promise<void> {
	new Promise(res => setTimeout(res, ms));
}

export function readEnv(variable: string): string {
	const ret = process.env[variable];
	if (ret)
		return ret;
	console.error(`Error: env variable ${variable} is not defined !`);
	process.exit(1);
}