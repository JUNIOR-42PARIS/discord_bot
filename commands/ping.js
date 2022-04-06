module.exports = {
	data: {
		name: "ping",
		description: "Give the ping",
	},
	async execute(interaction) {
		await interaction.reply(
			`🏓\n Ping : ${
				Date.now() - interaction.createdTimestamp
			}ms\n API's Ping: ${interaction.client.ws.ping}ms`
		);
	},
};
