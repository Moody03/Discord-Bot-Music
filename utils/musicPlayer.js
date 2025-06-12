// ====== utils/musicPlayer.js ======
// Created by 0xkhass - All Rights Reserved
// Music Player Utility

const { 
    createAudioPlayer, 
    createAudioResource, 
    joinVoiceChannel, 
    AudioPlayerStatus,
    VoiceConnectionStatus
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require('../config.json');

class MusicPlayer {
    constructor(guildId) {
        this.guildId = guildId;
        this.queue = [];
        this.currentSong = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.volume = config.defaultVolume;
        this.loopMode = 'off'; // off, song, queue
        this.connection = null;
        this.player = createAudioPlayer();
        this.textChannel = null;

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.handleSongEnd();
        });

        this.player.on('error', error => {
            console.error('❌ Audio player error:', error);
            this.handleSongEnd();
        });
    }

    async joinChannel(voiceChannel, textChannel) {
        this.textChannel = textChannel;
        
        try {
            this.connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            this.connection.subscribe(this.player);
            
            this.connection.on(VoiceConnectionStatus.Disconnected, () => {
                this.cleanup();
            });

            return true;
        } catch (error) {
            console.error('❌ Error joining voice channel:', error);
            return false;
        }
    }

    async addSong(song) {
        if (this.queue.length >= config.maxQueueSize) {
            throw new Error(`Queue is full! Maximum ${config.maxQueueSize} songs allowed.`);
        }

        this.queue.push(song);
        
        if (!this.isPlaying && !this.isPaused) {
            await this.playNext();
        }
    }

    async playNext() {
        if (this.queue.length === 0) {
            this.isPlaying = false;
            this.currentSong = null;
            return;
        }

        const song = this.queue.shift();
        this.currentSong = song;
        this.isPlaying = true;
        this.isPaused = false;

        try {
            const stream = ytdl(song.url, {
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            });

            const resource = createAudioResource(stream, {
                inlineVolume: true
            });

            resource.volume.setVolume(this.volume / 100);
            this.player.play(resource);

            if (this.textChannel) {
                this.textChannel.send({
                    embeds: [{
                        color: parseInt(config.embedColor.replace('#', ''), 16),
                        title: '🎵 Now Playing',
                        description: `**${song.title}**\nDuration: ${song.duration}`,
                        thumbnail: { url: song.thumbnail },
                        footer: { text: `Requested by ${song.requestedBy}` }
                    }]
                });
            }
        } catch (error) {
            console.error('❌ Error playing song:', error);
            this.handleSongEnd();
        }
    }

    handleSongEnd() {
        if (this.loopMode === 'song' && this.currentSong) {
            this.queue.unshift(this.currentSong);
        } else if (this.loopMode === 'queue' && this.currentSong) {
            this.queue.push(this.currentSong);
        }

        this.playNext();
    }

    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.player.pause();
            this.isPaused = true;
            return true;
        }
        return false;
    }

    resume() {
        if (this.isPaused) {
            this.player.unpause();
            this.isPaused = false;
            return true;
        }
        return false;
    }

    skip() {
        if (this.isPlaying) {
            this.player.stop();
            return true;
        }
        return false;
    }

    stop() {
        this.queue = [];
        this.currentSong = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.player.stop();
    }

    setVolume(volume) {
        if (volume < 0 || volume > config.maxVolume) {
            throw new Error(`Volume must be between 0 and ${config.maxVolume}`);
        }
        
        this.volume = volume;
        
        if (this.player.state.resource && this.player.state.resource.volume) {
            this.player.state.resource.volume.setVolume(volume / 100);
        }
    }

    shuffle() {
        if (this.queue.length < 2) return false;
        
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
        return true;
    }

    setLoop(mode) {
        const validModes = ['off', 'song', 'queue'];
        if (!validModes.includes(mode)) {
            throw new Error('Invalid loop mode. Use: off, song, or queue');
        }
        this.loopMode = mode;
    }

    cleanup() {
        this.stop();
        if (this.connection) {
            this.connection.destroy();
        }
    }
}

module.exports = MusicPlayer;