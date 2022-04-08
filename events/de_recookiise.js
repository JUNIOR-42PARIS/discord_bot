const valid_role_id = "960464388177940540";
const target_id = "503513696790642689";
// const astrid = "290940926103257089";

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (msg.content !== "décookiisé" && msg.content !== "recookiisé") return;
		if (!msg.member.roles.cache.map((role) => role.id).includes(valid_role_id))
			return;
		const member = await msg.guild.members.fetch(target_id);
		await msg.channel.send(`${member} tu es ${msg.content}`);
		msg.delete();
	},
};
