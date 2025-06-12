// ====== commands/queue.js ======
// Created by 0xkhass - All Rights Reserved
// Queue Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number (shows 10 songs per page)')
                .setMinValue(1)
        ),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);
        const page = interaction.options.getInteger('page') || 1;

        if (!musicPlayer || (!musicPlayer.currentSong && musicPlayer.queue.length === 0)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ The queue is empty!')
                ],
                ephemeral: true
            });
        }

        const itemsPerPage = 10;
        const totalPages = Math.ceil(musicPlayer.queue.length / itemsPerPage);
        
        if (page > totalPages && totalPages > 0) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ Page ${page} doesn't exist! Maximum page: ${totalPages}`)
                ],
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🎵 Music Queue');

        // Current song
        if (musicPlayer.currentSong) {
            const status = musicPlayer.isPaused ? '⏸️ Paused' : '▶️ Playing';
            embed.addFields({
                name: `${status} - Now`,
                value: `**${musicPlayer.currentSong.title}**\n*${musicPlayer.currentSong.duration}* - Requested by ${musicPlayer.currentSong.requestedBy}`,
                inline: false
            });
        }

        // Queue
        if (musicPlayer.queue.length > 0) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, musicPlayer.queue.length);
            
            let queueText = '';
            for (let i = startIndex; i < endIndex; i++) {
                const song = musicPlayer.queue[i];
                queueText += `**${i + 1}.** ${song.title}\n*${song.duration}* - ${song.requestedBy}\n\n`;
            }

            embed.addFields({
                name: `📋 Up Next (${musicPlayer.queue.length} songs)`,
                value: queueText || 'Queue is empty',
                inline: false
            });

            if (totalPages > 1) {
                embed.setFooter({ text: `Page ${page}/${totalPages} • Use /queue page:<number> to view other pages` });
            }
        }

        // Loop status
        if (musicPlayer.loopMode !== 'off') {
            const loopEmoji = musicPlayer.loopMode === 'song' ? '🔂' : '🔁';
            embed.addFields({
                name: 'Loop Status',
                value: `${loopEmoji} ${musicPlayer.loopMode === 'song' ? 'Song' : 'Queue'} loop enabled`,
                inline: true
            });
        }

        // Volume
        embed.addFields({
            name: 'Volume',
            value: `🔊 ${musicPlayer.volume}%`,
            inline: true
        });

        await interaction.reply({ embeds: [embed] });
    },
};