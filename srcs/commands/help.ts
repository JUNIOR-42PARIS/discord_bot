import { MessageEmbed } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import assert from 'assert';
import commands from '.';

export default {
	data: {
		name: 'help',
		description: 'List all commands and give informations about',
		options: [
			{
				type: 3,
				name: 'command',
				description: 'The command you want help on',
			},
		],
	},
	async execute(interaction: CommandInteraction): Promise<void> {
		const user = interaction.client.user;
		assert(user);
		const data = new MessageEmbed().setColor('RANDOM');
		const iconURL = user.avatarURL() ?? undefined;

		if (iconURL)
			data.setThumbnail(iconURL)
		/* General help */
		if (!interaction.options.getString('command')) {
			data
				.setAuthor({
					name: user.tag,
					iconURL,
				})
				.setTitle('**Man**')
				.setDescription(
					[
						`Hello, my name is ${user.username} !! 🖐`, 'Ask me `/help [command name]` to get infos about the command', '\n**Commands :**', commands.map(c => `\`/${c.data.name}\``).join('\n'),
					].join('\n')
				)
				.setFooter({ text: '</> with ❤ for LLD BDE 42 by Shocquen and Dhubleur' });

			try {
				interaction.reply({ embeds: [data] });
			} catch (err) {
				console.error(err);
			}
		} else {
			/* Help on a specific command */
			const cmdName = await interaction.options.getString('command');
			assert(cmdName);
			const cmd = commands.get(cmdName.toLocaleLowerCase());

			if (!cmd) 
				return interaction.reply('This commmand doesn\'t exist');

			data.setTitle(cmd.data.name);

			if (cmd.data.description) 
				data.setDescription(cmd.data.description);
			if (cmd.usage)
				data.addField('Usage', cmd.name + ' ' + (cmd.usage || ' '));
			try {
				interaction.reply({ embeds: [data] });
			} catch (err) {
				console.error(err);
			}
		}
	},
};
