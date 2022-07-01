import { MessageEmbed } from 'discord.js';
import { users } from '..';
import type { CommandInteraction } from 'discord.js';
import { readEnv } from '../utils';
import { authCommandDescription, commandFooter, authCommandTitle } from '../dictionary.json';

const redirect_uri = readEnv('SERVER_URL');

export default {
	data: {
		name: 'auth',
		description: authCommandDescription,
	},
	async execute(interaction: CommandInteraction): Promise<void> {
		const client = interaction.client;
		if (!client.user || !interaction.member?.user.id || !interaction.guildId)
			return;
		const data = new MessageEmbed().setColor('RANDOM');
		const url = await initAuth(interaction.member.user.id, interaction.guildId);
		const iconURL = client.user.avatarURL() ?? undefined;

		if (iconURL)
			data.setThumbnail(iconURL);

		console.log(`${interaction.user.username} [${interaction.user.id}] used /auth`);
		data
			.setAuthor({
				name: client.user.tag,
				iconURL,
			})
			.setTitle(authCommandTitle)
			.setDescription(`Clique [ici](${url}) pour t'authentifier`)
			.setFooter({ text: commandFooter });

		try {
			interaction.reply({ embeds: [data], ephemeral: true });
		} catch (err) {
			console.error(err);
		}
	},
};

async function initAuth(uid: string, guid: string): Promise<string> {
	const user = await users.insertOne({ uid, guid });
	const url = `${redirect_uri}/?c=${user.insertedId}`;
	return url;
}
