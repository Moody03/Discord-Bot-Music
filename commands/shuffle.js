// ====== commands/shuffle.js ======
// Created by 0xkhass - All Rights Reserved
// Shuffle Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);

        if (!musicPlayer || musicPlayer.queue.length < 2) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Need at least 2 songs in queue to shuffle!')
                ],
                ephemeral: true
            });
        }

        const shuffled = musicPlayer.shuffle();
        
        if (shuffled) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(`🔀 Queue shuffled! **${musicPlayer.queue.length}** songs randomized.`)
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ Failed to shuffle queue!')
                ],
                ephemeral: true
            });
        }
    },
};
