const cookie_role = "960464388177940540";
const target_id = "474355372799557643";
const astrid = "290940926103257089";

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (msg.author.id !== astrid) return;
		switch (msg.content.toLowerCase()) {
			case "décookiisé":
				try {
					const member = await msg.guild.members.fetch(target_id);
					if (member.roles.cache.map((role) => role.id).includes(cookie_role))
						return msg.reply("Elle est déjà décookiisée");
					await msg.channel.send(
						`${member} tu es ${msg.content.toLowerCase()}! 🍪`
					);
					await member.roles.add(cookie_role);
				} catch (err) {
					console.error(err);
				}
				break;
			case "recookiisé":
				try {
					const member = await msg.guild.members.fetch(target_id);
					if (!member.roles.cache.map((role) => role.id).includes(cookie_role))
						return msg.reply("Elle a déjà un 🍪");
					await msg.channel.send(
						`${member} tu es ${msg.content.toLowerCase()}! 🍪`
					);
					await member.roles.remove(cookie_role);
				} catch (err) {
					console.error(err);
				}

				break;
		}
	},
};
