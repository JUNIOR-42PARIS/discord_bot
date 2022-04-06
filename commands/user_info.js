require("dotenv").config();

const { api_uri: uri } = require("../config.json");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const { stripIndents } = require("common-tags");
const moment = require("moment");
const { getToken } = require("../utils.js");

module.exports = {
	data: {
		name: "user_info",
		description: "Get some info about a 42 student",
		options: [
			{
				type: 3,
				name: "login",
				description: "42's login",
				required: true,
			},
		],
	},
	async execute(interaction) {
		const login = await interaction.options.getString("login").toLowerCase();
		const token = await getToken();
		const config = {
			headers: {
				Authorization: "Bearer " + token,
			},
		};
		axios
			.get(uri + "users/" + login, config)
			.then((res) => {
				const user = res.data;
				const embed = new MessageEmbed().setColor("RANDOM");
				const member = interaction.member;
				embed
					.setAuthor({
						name: user.login,
						iconURL: user.image_url,
						url: user.url,
					})
					.setTitle(`${user.login}'s infos`)
					.setURL("https://profile.intra.42.fr/users/" + user.login)
					.setThumbnail(user.image_url)
					.setFooter({
						text: `Asked by ${member.displayName}`,
						iconURL: member.avatarURL(),
					})
					.setTimestamp()
					.setDescription(user.displayname)
					.addFields(
						{
							name: "piscine",
							value: `${user.pool_month} ${user.pool_year}`,
							inline: true,
						},
						{
							name: "email",
							value: user.email,
							inline: true,
						},
						{
							name: "wallets",
							value: user.wallet.toString(),
							inline: true,
						},
						{
							name: "campus",
							value: getPrimaryCampus(user).city,
							inline: true,
						}
					);

				const cursus = user.cursus_users.filter(
					(cur) => cur.grade === "Learner"
				)[0];
				if (cursus) {
					embed.addFields(
						{
							name: "level",
							value: cursus.level.toString(),
							inline: true,
						},
						{
							name: "BlackHoled at",
							value: moment(cursus.blackholed_at).format("MMMM Do YYYY"),
							inline: true,
						}
					);
				}

				if (user.alumni) embed.addField("alumni", "🟢", true);

				if (user.groups.length) {
					let groups = [];
					user.groups.forEach((group) => groups.push(group.name.toLowerCase()));
					embed.addField("groups", groups.join("\n"));
				}
				if (user.titles.length) {
					let titles = [];
					user.titles.forEach((title) =>
						titles.push(title.name.replace("%login", user.login))
					);
					embed.addField("titles", titles.join("\n"));
				}
				interaction.reply({ embeds: [embed] });
			})
			.catch((err) => {
				if (err.response) console.log("status " + err.response.status);
				else console.log(err);
				interaction.reply(`${login} is not found in the 42's Intra.`);
			});
	},
};

function getPrimaryCampus(user) {
	const primary = user.campus_users.filter((camp) => camp.is_primary)[0];
	return user.campus.filter((camp) => camp.id === primary.campus_id)[0];
}
