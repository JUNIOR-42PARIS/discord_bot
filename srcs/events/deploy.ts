import type { Message } from 'discord.js';
import { deployCommands } from '../deploy-commands';

const restricted_guilds = process.env.RESTRICTED_GUILD?.split(':');

// TODO: This should be a global commands, there are now permissions the allow restricting commands to administrators
export default {
	name: 'messageCreate',
	async execute(msg: Message): Promise<void> {
		if (msg.author.bot)
			return;
		if (restricted_guilds && msg.guildId && restricted_guilds.includes(msg.guildId))
			return;
		if (!msg.member?.permissions.has('ADMINISTRATOR'))
			return;
		if (msg.content.toLowerCase() === `${msg.client.user?.username.toLowerCase()}.deploy`) {
			await deployCommands(msg.guild!.id);
			msg.reply(`Commands deployed on ${msg.guild!.name}!`);
		}
	},
};
