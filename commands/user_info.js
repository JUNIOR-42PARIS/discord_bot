require("dotenv").config();

const { api_uri: uri } = require("../config.json");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const { stripIndents } = require("common-tags");
const moment = require("moment");
const { getToken, sleep } = require("../utils.js");

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
		const { color } = await getCoa(login, config);
		const location = await getLocation(login, config);
		axios
			.get(uri + "users/" + login, config)
			.then((res) => {
				const user = res.data;
				const embed = new MessageEmbed().setColor(color);
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
							name: "Black Hole absorption",
							value: moment(cursus.blackholed_at).format("MMMM Do YYYY"),
							inline: true,
						}
					);
				}

				if (user.alumni) embed.addField("alumni", "🟢", true);

				if (user.groups.length) {
					let groups = [];
					user.groups.forEach((group) => groups.push(group.name.toLowerCase()));
					embed.addField("groups", groups.join("\n"), true);
				}
				if (user.titles.length) {
					let titles = [];
					user.titles.forEach((title) =>
						titles.push(title.name.replace("%login", user.login))
					);
					embed.addField("titles", titles.join("\n"), true);
				}
				if (location) embed.addField("Location", location, true);

				interaction.reply({ embeds: [embed] });
			})
			.catch((err) => {
				if (err.response) console.log("status " + err.response.status);
				else console.log(err);
				interaction.reply(`${login} is not found in the 42's Intra.`);
			});
	},
};

// todo : 2 req API 42 / sec dépassés => go timout entre chaques

function getPrimaryCampus(user) {
	const primary = user.campus_users.filter((camp) => camp.is_primary)[0];
	return user.campus.filter((camp) => camp.id === primary.campus_id)[0];
}

async function getCoa(user, config) {
	return await axios
		.get(uri + "users/" + user + "/coalitions", config)
		.then((res) => {
			sleep(500);
			return res.data.filter((coa) => coa.slug.includes("42cursus-paris"))[0];
		})
		.catch((err) => console.log(err));
}

async function getLocation(user, config) {
	return await axios
		.get(uri + "users/" + user + "/locations", config)
		.then((res) => {
			sleep(500);
			if (!res.data[0].end_at) return res.data[0].host;
			return null;
		})
		.catch((err) => console.log(err));
}
