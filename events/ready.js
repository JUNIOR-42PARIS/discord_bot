module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		client.user.setPresence({
			status: 'online',
			activity: {
				name: "attendre la Saint-Patrâcques",
				type: "PLAYING"
			}
		});
		console.log(`${client.user.username}'s up!`);
	},
};
