// ====== commands/loop.js ======
// Created by 0xkhass - All Rights Reserved
// Loop Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set loop mode for music playback')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode')
                .setRequired(true)
                .addChoices(
                    { name: '🔴 Off', value: 'off' },
                    { name: '🔂 Current Song', value: 'song' },
                    { name: '🔁 Entire Queue', value: 'queue' }
                )
        ),

    async execute(interaction) {
        const musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);
        const mode = interaction.options.getString('mode');

        if (!musicPlayer) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('❌ No music player found! Use `/play` to start playing music.')
                ],
                ephemeral: true
            });
        }

        try {
            musicPlayer.setLoop(mode);
            
            const modeText = {
                'off': '🔴 Loop disabled',
                'song': '🔂 Looping current song',
                'queue': '🔁 Looping entire queue'
            };

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(modeText[mode])
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