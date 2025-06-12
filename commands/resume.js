// ====== commands/resume.js ======
// Created by 0xkhass - All Rights Reserved
// Resume Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || !musicPlayer.isPaused) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music is paused!')
                ],
                ephemeral: true
            });
        }

        const resumed = musicPlayer.resume();
        
        if (resumed) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription('▶️ Music resumed!')
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to resume music!')
                ],
                ephemeral: true
            });
        }
    },
};
