const { MessageEmbed } = require("discord.js");
const { initAuth } = require("../utils.js");

module.exports = {
	data: {
		name: "auth",
		description: "Allows to authenticate with the api of 42"
	},
	async execute(interaction) {
		const client = interaction.client;
        const data = new MessageEmbed().setColor("RANDOM");
        const url = initAuth(interaction.member.user.id);

        data
				.setAuthor({
					name: client.user.tag,
					iconURL: client.user.avatarURL(),
				})
				.setThumbnail(client.user.avatarURL())
				.setTitle("Code")
				.setDescription(
					[
						url
					].join("\n")
				)
				.setFooter({ text: `</> with ❤ for LLD BDE 42 by Shocquen` });

			try {
				interaction.reply({ embeds: [data] });
			} catch (err) {
				console.error(err);
			}
	},
};
