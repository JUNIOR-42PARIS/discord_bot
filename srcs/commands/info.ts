import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import assert from 'assert';
import { commandFooter, sourceCode, infoTitle, infoDescription, infoCommandDescription } from '../dictionary.json';

export default {
	data: {
		name: 'info',
		description: infoCommandDescription,
	},
	async execute(interaction: CommandInteraction): Promise<void> {
		const data = new MessageEmbed();
		const user = interaction.client.user;
		assert(user);
		const iconURL = user.avatarURL() ?? undefined;

		if (iconURL)
			data.setThumbnail(iconURL);

		data
			.setColor('#ef8058')
			.setAuthor({
				name: user.tag,
				iconURL,
			})
			.setTitle(infoTitle)
			.setDescription(infoDescription)
			.addField('Source code', sourceCode)
			.setFooter({ text: commandFooter });
		// const guild = await client.guilds.fetch('827959858027298836');
		// await guild.members.fetch();

		// const bde = await guild.roles.fetch('954023542138241084');
		// const pre = await guild.roles.fetch('959393421846511636');
		// const bureau = await guild.roles.fetch('963125932237922304');
		// data.addFields([
		// 	{
		// 		name: 'Guide suprême',
		// 		value: pre.members.map(m => m).join('\n'),
		// 		inline: false,
		// 	}, {
		// 		name: 'Bureau',
		// 		value: bureau.members.map(m => m).join('\n'),
		// 		inline: true,
		// 	}, {
		// 		name: 'Membres',
		// 		value: bde.members.map(m => m).join('\n'),
		// 		inline: true,
		// 	},
		// ]);
		// data.addField("Membres", bde.members.map((m) => m).join("\n"));
		interaction.reply({ embeds: [data] });
	},
};
