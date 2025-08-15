const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const command = require('../../../../main/discord/core/commands/command.js');

/* eslint-disable no-unused-vars, no-constant-condition */
if (null) {
	const heartType = require('../../../../types/heart.js');
	const commandType = require('../../../../types/discord/core/commands/commands.js');
	const { CommandInteraction } = require('discord.js');
}
/* eslint-enable no-unused-vars, no-constant-condition  */


/**
 * quotethat command class.
 * @class
 * @extends commandType
 */
module.exports = class quotethat extends command {
	/**
     * Creates an instance of the command.
     * @param {heartType} heart - The heart of the bot.
     * @param {Object} cmdConfig - The command configuration.
     */
	constructor(heart, cmdConfig) {
		const quoteConfig = heart.core.discord.core.config.manager.get('quotethat').get();

		super(heart, {
			name: 'quotethat',
			data: new SlashCommandBuilder()
				.setName('quotethat')
				.setDescription('Hey Bot! Quotethat!')
				.addStringOption(option => option.setName('messageid').setDescription('The message id to quote').setRequired(true)),
			contextMenu: false,
			global: true,
			category: 'fun',
			bypass: true,
			permissionLevel: quoteConfig.config.permissions.quotethat_command,
		});
	}

	/**
     * Executes the command.
     * @param {CommandInteraction} interaction - The interaction object.
     * @param {Object} langConfig - The language configuration.
     */
	async execute(interaction, langConfig) {
		try {
			const targetMessageId = interaction.options.getString('messageid'); // Get the message ID from the user's input
			const message = await interaction.channel.messages.fetch(targetMessageId);
			const authorUsername = message.author.username;
			const embed = {
				"author": {
					"name": "Quote That!"
				},
				"title": "%message% - %user%",
				"description": "Quoted by %interaction_user%",
				"color": "#f58300ff",
				"defaultFooter": true,
				"defaultTimestamp": true,
			}
			const placeholders = {
				interaction_user: interaction.user.username,
				message: message.content,
				user: authorUsername

			};

			interaction.reply({ embeds: [this.heart.core.util.discord.resolveEmbed(embed, placeholders)] });
		}
		catch (err) {
			this.heart.core.console.log(this.heart.core.console.type.error, `An issue occured while executing command ${this.getName()}`);
			new this.heart.core.error.interface(this.heart, err);
			interaction.reply({ embeds: [this.heart.core.util.discord.generateErrorEmbed(langConfig.lang.unexpected_command_error.replace(/%command%/g, `/${interaction.commandName}`))], flags: MessageFlags.Ephemeral });
		}
	}
};
