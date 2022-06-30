import { MessageEmbed } from "discord.js";
import { users } from "..";
import { Interaction, User } from "discord.js";

export default {
	data: {
		name: "auth",
		description: "Allows to authenticate with the api of 42",
	},
	async execute(interaction: any) {
		const client = interaction.client;
		if (!client.user || !interaction.member?.user.id || !interaction.guildId)
			return;
		const data = new MessageEmbed().setColor("RANDOM");
		const url = await initAuth(interaction.member.user.id, interaction.guildId);

		console.log(
			`${interaction.user.username} [${interaction.user.id}] used /auth`
		);
		data
			.setAuthor({
				name: client.user.tag,
				iconURL: client.user.avatarURL()!,
			})
			.setThumbnail(client.user.avatarURL()!)
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

async function initAuth(uid: string, guid: string) {
	// let db = readDB("./auth_server/users.json");
	// const code = generateUniqueCode();
	// db.push({ code: code, id: discordUserId });
	// writeDB("./auth_server/users.json", db);
	const user = await users.insertOne({ uid, guid });
	const url = "https://auth.bde42.me?c=" + user.insertedId;
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
