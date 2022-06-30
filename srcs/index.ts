require("dotenv").config();

import { Client, Intents } from "discord.js";
import { startApp } from "./server";
import { readEnv } from "./utils";
import { Collection, MongoClient } from "mongodb";

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

import events from "./events";

for (const event of events) {
	if (event.once) {
		//@ts-ignore
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		//@ts-ignore
		client.on(event.name, (...args) => event.execute(...args));
	}
}
const mongo = new MongoClient(readEnv("MONGO_URI"));
export type SavedUser = { uid: string, guid: string };
export let users: Collection<SavedUser>;
mongo.connect().then(() => {
	const httpServer = startApp(client);
	client.login(readEnv("DISCORD_BOT_TOKEN"));
	users = mongo.db(readEnv("DB")).collection("discord_users");
	
	const port = 2424;
	httpServer.listen(port, () => {
		console.log("Server running on port " + port);
	});
})
