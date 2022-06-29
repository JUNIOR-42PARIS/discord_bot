export default {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`${client.user.username}'s up!`);
	},
};
