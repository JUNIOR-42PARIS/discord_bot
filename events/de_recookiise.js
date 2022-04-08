const valid_role_id = "960464388177940540";
const target_id = "474355372799557643";
// const astrid = "290940926103257089";

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (
			msg.content.toLowerCase() !== "décookiisé" &&
			msg.content.toLowerCase() !== "recookiisé"
		)
			return;
		if (!msg.member.roles.cache.map((role) => role.id).includes(valid_role_id))
			return;
		try {
			const member = await msg.guild.members.fetch(target_id);
			await msg.channel.send(`${member} tu es ${msg.content}`);
		} catch (err) {
			console.error(err);
		}
		msg.delete();
	},
};
