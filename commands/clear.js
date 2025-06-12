// ====== commands/clear.js ======
// Created by 0xkhass - All Rights Reserved
// Clear Queue Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the music queue (keeps current song playing)'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || musicPlayer.queue.length === 0) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ The queue is already empty!')
                ],
                ephemeral: true
            });
        }

        const clearedCount = musicPlayer.queue.length;
        musicPlayer.queue = [];

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.embedColor)
                .setDescription(`🗑️ Cleared **${clearedCount}** songs from the queue!`)
            ]
        });
    },
};