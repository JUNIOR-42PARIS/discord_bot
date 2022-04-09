const { stripIndents } = require("common-tags");
const { sleep } = require("../utils.js");
const tuteurs = "960464388177940540";

module.exports = {
	name: "messageCreate",
	async execute(msg) {
		if (msg.author.bot) return;
		if (!msg.member.roles.cache.map((role) => role.id).includes(tuteurs))
			return;
		if (msg.content.toLowerCase() !== "ascenseur") return;

		const ret = await msg.channel.send(stripIndents`
		🛗 
		⛓ 
		⛓ 
		⛓ 
	`);
		await sleep(300);
		ret.edit(stripIndents`
		⛓ 
		🛗 
		⛓ 
		⛓ 
	`);
		await sleep(300);
		ret.edit(stripIndents`
		⛓ 
		⛓ 
		🛗 
		⛓ 
	`);
		await sleep(300);
		ret.edit(stripIndents`
		⛓ 
		⛓ 
		⛓ 
		🛗 
	`);
	},
};
