// ====== commands/pause.js ======
// Created by 0xkhass - All Rights Reserved
// Pause Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || !musicPlayer.isPlaying) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music is currently playing!')
                ],
                ephemeral: true
            });
        }

        if (musicPlayer.isPaused) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FFA500')
                    .setDescription('⏸️ Music is already paused!')
                ],
                ephemeral: true
            });
        }

        const paused = musicPlayer.pause();
        
        if (paused) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription('⏸️ Music paused!')
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to pause music!')
                ],
                ephemeral: true
            });
        }
    },
};