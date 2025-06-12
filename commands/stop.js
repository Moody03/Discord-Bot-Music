// ====== commands/stop.js ======
// Created by 0xkhass - All Rights Reserved
// Stop Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop music and clear the queue'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || (!musicPlayer.isPlaying && musicPlayer.queue.length === 0)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music is playing or queued!')
                ],
                ephemeral: true
            });
        }

        musicPlayer.stop();
        
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.embedColor)
                .setDescription('⏹️ Music stopped and queue cleared!')
            ]
        });
    },
};