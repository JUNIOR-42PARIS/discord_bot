require("dotenv").config();

const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
const { log } = require("node:console");

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.commands = new Collection();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once("ready", () => {
	console.log(`${client.user.username}'s up!`);
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.on("messageCreate", async (msg) => {
	if (msg.author.bot) return;
	if (msg.content.toLowerCase().includes("beer"))
		msg.react("<a:abeer:953956146287366175>");
	if (msg.mentions.everyone || msg.content.toLowerCase().includes("lld")) {
		const emoji =
			msg.guildId === "498924099666575361"
				? "<a:Coin:501037083847032842>"
				: "<a:alld:953955942234468352>";
		msg.react(emoji);
	}
	if (!msg.member.permissions.has("ADMINISTRATOR")) return;
	if (msg.content === "lld.deploy") {
		const { deploy_commands } = require("./deploy-commands");
		deploy_commands();
		msg.reply("Commands deployed!");
	}
});

client.login(process.env.TOKEN);
