import type { CommandInteraction } from "discord.js";
import commands from "../commands";

export default {
	name: "interactionCreate",
	async execute(interaction: CommandInteraction) {
		if (!interaction.isCommand()) return;

		const command = await commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	},
};
