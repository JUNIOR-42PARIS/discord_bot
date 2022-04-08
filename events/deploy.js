const { deploy_commands } = require("../deploy-commands");

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;

		if (!msg.member.permissions.has("ADMINISTRATOR")) return;
		if (msg.content === "lld.deploy") {
			deploy_commands(msg.guild.id);
			msg.reply(`Commands deployed on ${msg.guild.name}!`);
		}
	},
};
