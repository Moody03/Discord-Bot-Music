// ====== commands/skip.js ======
// Created by 0xkhass - All Rights Reserved
// Skip Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

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

        const currentSong = musicPlayer.currentSong;
        const skipped = musicPlayer.skip();
        
        if (skipped) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`⏭️ Skipped: **${currentSong?.title || 'Unknown'}**`)
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to skip song!')
                ],
                ephemeral: true
            });
        }
    },
};