import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import assert from 'assert';

export default {
	data: {
		name: 'info',
		description: 'Informations about the BDE LLD',
	},
	async execute(interaction: CommandInteraction): Promise<void> {
		const data = new MessageEmbed();
		const user = interaction.client.user;
		assert(user);
		const iconURL = user.avatarURL() ?? undefined;

		if (iconURL)
			data.setThumbnail(iconURL)

		data
			.setColor('#ef8058')
			.setAuthor({
				name: user.tag,
				iconURL,
			})
			.setTitle('La Liste Déchaînée')
			.setDescription(
				stripIndents`
			La Liste Déchaînée a le plaisir de se présenter à vous en tant que BDE de l’école 42 Paris.
			Animations, événements et bonne ambiance sont nos objectifs.
		`
			)
			.addField('Source code', 'https://github.com/shocquen/lld_bot_discord')
			.setFooter({ text: '</> with ❤ for LLD BDE 42 by Shocquen & Dhubleur' });
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
