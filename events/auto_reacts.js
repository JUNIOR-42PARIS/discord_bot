const { restricted_guilds } = require("../config.json");

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (restricted_guilds.includes(msg.guild.id)) return;

		const client = msg.client;

		try {
			if (msg.content.toLowerCase().includes("beer")) {
				const emoji = await client.emojis.cache.find(
					(e) => e.name === "catRoll"
				);
				msg.reply(emoji.toString());
			}

			if (msg.mentions.everyone || msg.content.toLowerCase().includes("lld")) {
				const emoji = await client.emojis.cache.find(
					(e) => e.name === "catRoll"
				);
				await msg.react(emoji);
			}
		} catch (error) {
			console.error(error);
		}
	},
};
