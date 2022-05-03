const { MessageEmbed } = require("discord.js");
const { readDB, writeDB } = require("../utils.js");

module.exports = {
	data: {
		name: "auth",
		description: "Allows to authenticate with the api of 42",
	},
	async execute(interaction) {
		const client = interaction.client;
		const data = new MessageEmbed().setColor("RANDOM");
		const url = initAuth(interaction.member.user.id);

		data
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL(),
			})
			.setThumbnail(client.user.avatarURL())
			.setTitle("Authentifie toi !")
			.setDescription(`Clique [ici](${url}) pour t'authentifier`)
			.setFooter({
				text: `</> with ❤ for LLD BDE 42 by Shocquen and Dhubleur`,
			});

		try {
			interaction.reply({ embeds: [data], ephemeral: true });
		} catch (err) {
			console.error(err);
		}
	},
};

function initAuth(discordUserId) {
	let db = readDB("./auth_server/users.json");
	const code = generateUniqueCode();
	db.push({ code: code, id: discordUserId });
	writeDB("./auth_server/users.json", db);
	const url = "https://auth.bde42.me?user_code=" + code;
	return url;
}
function generateUniqueCode() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 5; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}
