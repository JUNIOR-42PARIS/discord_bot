/* 
	Ceci est un troll mérité envers rleseur, tutrice aux cheveux rouges.
	Troll voté et voulu par tous les tuteurs.
	<3 Romane. Cookie
*/
module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;

		try {
			if (msg.author.id === "474355372799557643") await msg.react("🍪");
		} catch (err) {
			console.error(err);
		}
	},
};
