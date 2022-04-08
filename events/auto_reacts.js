module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;

		try {
			if (msg.content.toLowerCase().includes("beer"))
				await msg.react("<a:abeer:953956146287366175>");

			if (msg.mentions.everyone || msg.content.toLowerCase().includes("lld")) {
				const emoji =
					msg.guildId === "498924099666575361"
						? "<a:Coin:501037083847032842>"
						: "<a:alld:953955942234468352>";
				await msg.react(emoji);
			}
		} catch (error) {
			console.error(error);
		}
	},
};
