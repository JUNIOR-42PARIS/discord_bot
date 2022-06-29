require("dotenv").config();

import fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId } from "./config.json";

export function deployCommands(guildId) => {
	const commands = [];
	const commandFiles = fs
		.readdirSync("./commands")
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data);
	}

	const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

	rest
		.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log("Successfully registered application commands."))
		.catch(console.error);
};


