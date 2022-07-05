import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import assert from 'assert';
import { commandFooter, sourceCode, infoTitle, infoDescription, infoCommandDescription } from '../dictionary.json';

const ownerGuildId = process.env.INFO_GUILDID;
const memberRoles: Record<string, string> | undefined = (() => {
	if (process.env.MEMBER_ROLES_JSON) {
		try {
			return JSON.parse(process.env.MEMBER_ROLES_JSON)
		} catch {}
	}
})();

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
		if (ownerGuildId && memberRoles) {
			const client = interaction.client;
			const guild = await client.guilds.fetch(ownerGuildId);
			await guild.members.fetch();
			let alreadyAdded: string[] = [];
			for (const [roleId, roleName] of Object.entries(memberRoles)) {
				const role = await guild.roles.fetch(roleId);
				if (!role)
					continue;
				const members = Array.from(role.members.filter((_, k) => !alreadyAdded.includes(k)).keys());
				alreadyAdded.push(...members);
				data.addField(roleName, members.join('\n'), false);
			}
		}

		interaction.reply({ embeds: [data] });
	},
};
