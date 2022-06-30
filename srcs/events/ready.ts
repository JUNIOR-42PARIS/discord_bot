import type { Client } from "discord.js";

export default {
	name: "ready",
	once: true,
	execute(client: Client) {
		console.log(`${client.user?.username}'s up!`);
	},
};
