const { MessageEmbed } = require("discord.js");

module.exports = {
	data: {
		name: "help",
		description: "List all commands and give informations about",
		options: [
			{
				type: 3,
				name: "command",
				description: "The command you want help on",
			},
		],
	},
	async execute(interaction) {
		const client = interaction.client;
		const data = new MessageEmbed().setColor("RANDOM");

		/* General help */
		if (!interaction.options.getString("command")) {
			data
				.setAuthor({
					name: client.user.tag,
					iconURL: client.user.avatarURL(),
				})
				.setThumbnail(client.user.avatarURL())
				.setTitle("**Man**")
				.setDescription(
					[
						`Hello, my name is ${client.user.username} !! 🖐`,
						`Ask me \`/help [command name]\` to get infos about the command`,
						"\n**Commands :**",
						client.commands.map((c) => `\`/${c.data.name}\``).join("\n"),
					].join("\n")
				)
				.setFooter({ text: `</> with ❤ for LLD BDE 42 by Shocquen` });

			try {
				interaction.reply({ embeds: [data] });
			} catch (err) {
				console.error(err);
			}
		} else {
			/* Help on a specific command */
			const cmdName = await interaction.options
				.getString("command")
				.toLowerCase();
			const cmd = interaction.client.commands.get(cmdName);

			if (!cmd) return interaction.reply("This commmand doesn't exist");

			data.setTitle(cmd.data.name);

			if (cmd.data.description) data.setDescription(cmd.data.description);
			if (cmd.usage)
				data.addField("Usage", prefix + cmd.name + " " + (cmd.usage || " "));
			try {
				interaction.reply({ embeds: [data] });
			} catch (err) {
				console.error(err);
			}
		}
	},
};
