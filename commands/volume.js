// ====== commands/volume.js ======
// Created by 0xkhass - All Rights Reserved
// Volume Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set or check the music volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription(`Volume level (0-${config.maxVolume})`)
                .setMinValue(0)
                .setMaxValue(config.maxVolume)
        ),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);
        const volumeLevel = interaction.options.getInteger('level');

        if (!musicPlayer) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music player found! Use `/play` to start playing music.')
                ],
                ephemeral: true
            });
        }

        // If no volume specified, show current volume
        if (volumeLevel === null) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`🔊 Current volume: **${musicPlayer.volume}%**`)
                ]
            });
        }

        try {
            musicPlayer.setVolume(volumeLevel);
            
            const volumeEmoji = volumeLevel === 0 ? '🔇' : 
                               volumeLevel < 30 ? '🔈' : 
                               volumeLevel < 70 ? '🔉' : '🔊';

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`${volumeEmoji} Volume set to **${volumeLevel}%**`)
                ]
            });
        } catch (error) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ ${error.message}`)
                ],
                ephemeral: true
            });
        }
    },
};