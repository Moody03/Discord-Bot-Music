// ====== commands/play.js ======
// Created by 0xkhass - All Rights Reserved
// Play Command

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicPlayer = require('../utils/musicPlayer');
const YouTubeSearch = require('../utils/youtubeSearch');
const SpotifySearch = require('../utils/spotifySearch');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube or Spotify')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name, YouTube URL, or Spotify URL')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription('❌ You need to be in a voice channel to play music!')
                ],
                ephemeral: true
            });
        }

        await interaction.deferReply();

        try {
            let musicPlayer = interaction.client.musicPlayers.get(interaction.guildId);
            
            if (!musicPlayer) {
                musicPlayer = new MusicPlayer(interaction.guildId);
                interaction.client.musicPlayers.set(interaction.guildId, musicPlayer);
            }

            if (!musicPlayer.connection) {
                const joined = await musicPlayer.joinChannel(voiceChannel, interaction.channel);
                if (!joined) {
                    throw new Error('Failed to join voice channel');
                }
            }

            let songInfo;
            let isPlaylist = false;

            // Check if it's a Spotify URL
            if (SpotifySearch.isSpotifyUrl(query)) {
                const spotifySearch = new SpotifySearch();
                const spotifyData = SpotifySearch.extractSpotifyId(query);
                
                if (!spotifyData) {
                    throw new Error('Invalid Spotify URL');
                }

                if (spotifyData.type === 'track') {
                    songInfo = await spotifySearch.searchTrack(query);
                } else if (spotifyData.type === 'playlist') {
                    const playlist = await spotifySearch.getPlaylist(spotifyData.id);
                    isPlaylist = true;
                    
                    for (const song of playlist.songs) {
                        await musicPlayer.addSong({
                            ...song,
                            requestedBy: member.displayName
                        });
                    }

                    return interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(config.embedColor)
                            .setTitle('✅ Playlist Added')
                            .setDescription(`Added **${playlist.songs.length}** songs from **${playlist.name}** to the queue`)
                            .setFooter({ text: `Requested by ${member.displayName}` })
                        ]
                    });
                }
            } else {
                // YouTube search or URL
                songInfo = await YouTubeSearch.search(query);
            }

            if (!isPlaylist) {
                await musicPlayer.addSong({
                    ...songInfo,
                    requestedBy: member.displayName
                });

                const embed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setTitle('✅ Song Added to Queue')
                    .setDescription(`**${songInfo.title}**\nDuration: ${songInfo.duration}`)
                    .setThumbnail(songInfo.thumbnail)
                    .setFooter({ text: `Requested by ${member.displayName}` });

                if (musicPlayer.queue.length > 1 || (musicPlayer.isPlaying && !musicPlayer.isPaused)) {
                    embed.addFields({ 
                        name: 'Position in Queue', 
                        value: `${musicPlayer.queue.length}`, 
                        inline: true 
                    });
                }

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('❌ Play command error:', error);
            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`❌ ${error.message}`)
                ],
                ephemeral: true
            });
        }
    },
};