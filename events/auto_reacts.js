const { restricted_guilds } = require("../config.json");
const beers = [
	"beer",
	"ipa",
	"pils",
	"bière",
	"ale",
	"bibine",
	"boîte",
	"bock",
	"boisson",
	"caisse",
	"cénotaphe",
	"cervoise",
	"chope",
	"faro",
	"ginger",
	"gueuze",
	"guinness",
	"kriek",
	"lambic",
	"litre",
	"pale-ale",
	"porter",
	"saké",
	"sépulcre",
	"sarcophage",
	"stout",
	"phéno",
	"pheno",
	"phénos",
	"phenos",
];

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (restricted_guilds.includes(msg.guild.id)) return;

		const client = msg.client;

		try {
			if (beers.map((b) => msg.content.toLowerCase().includes(b))) {
				const emoji = await client.emojis.cache.find((e) => e.name === "abeer");
				msg.react(emoji.toString());
			}

			if (msg.mentions.everyone || msg.content.toLowerCase().includes("lld")) {
				const emoji = await client.emojis.cache.find((e) => e.name === "lld");
				await msg.react(emoji);
			}
		} catch (error) {
			console.error(error);
		}
	},
};
