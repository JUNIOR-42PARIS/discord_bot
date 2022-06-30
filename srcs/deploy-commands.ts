require("dotenv").config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readEnv } from "./utils";
import commands from "./commands";

const appId = readEnv("DISCORD_APP_ID");
const token = readEnv("DISCORD_BOT_TOKEN");

export async function deployCommands(guildId: string) {
	const rest = new REST({ version: "9" }).setToken(token);

	await rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands.map(value => value.data) })
	console.log("Successfully registered application commands.")
};


