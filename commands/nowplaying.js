// ====== commands/nowplaying.js ======
// Created by 0xkhass - All Rights Reserved
// Now Playing Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the currently playing song'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || !musicPlayer.currentSong) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music is currently playing!')
                ],
                ephemeral: true
            });
        }

        const song = musicPlayer.currentSong;
        const status = musicPlayer.isPaused ? '⏸️ Paused' : '▶️ Playing';

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${status} Now Playing`)
            .setDescription(`**${song.title}**`)
            .addFields(
                { name: '⏱️ Duration', value: song.duration, inline: true },
                { name: '📺 Channel', value: song.uploader || 'Unknown', inline: true },
                { name: '🔊 Volume', value: `${musicPlayer.volume}%`, inline: true },
                { name: '👤 Requested by', value: song.requestedBy, inline: true }
            )
            .setThumbnail(song.thumbnail);

        if (musicPlayer.loopMode !== 'off') {
            const loopEmoji = musicPlayer.loopMode === 'song' ? '🔂' : '🔁';
            embed.addFields({
                name: 'Loop',
                value: `${loopEmoji} ${musicPlayer.loopMode === 'song' ? 'Song' : 'Queue'}`,
                inline: true
            });
        }

        if (musicPlayer.queue.length > 0) {
            embed.addFields({
                name: '📋 Up Next',
                value: `**${musicPlayer.queue[0].title}**\n*and ${musicPlayer.queue.length - 1} more...*`,
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};