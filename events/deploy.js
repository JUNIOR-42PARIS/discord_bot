const { deploy_commands } = require("../deploy-commands");
const { restricted_guilds } = require("../config.json");

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (restricted_guilds.includes(msg.guild.id)) return;

		if (!msg.member.permissions.has("ADMINISTRATOR")) return;
		if (msg.content === "lld.deploy") {
			deploy_commands(msg.guild.id);
			msg.reply(`Commands deployed on ${msg.guild.name}!`);
		}
	},
};
