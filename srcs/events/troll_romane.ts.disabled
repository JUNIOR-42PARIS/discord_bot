/* 
	Ceci est un troll mérité envers rleseur, tutrice aux cheveux rouges.
	Troll voté et voulu par tous les tuteurs.
	<3 Romane. Cookie
*/

const { restricted_guilds } = require("../config.json");

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (restricted_guilds.includes(msg.guild.id)) return;

		try {
			if (msg.author.id === "474355372799557643") await msg.react("🍪");
		} catch (err) {
			console.error(err);
		}
	},
};
