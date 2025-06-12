// ====== utils/spotifySearch.js ======
// Created by 0xkhass - All Rights Reserved
// Spotify Search Utility (fallback to YouTube)

const SpotifyWebApi = require('spotify-web-api-node');
const YouTubeSearch = require('./youtubeSearch');

class SpotifySearch {
    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        });
        
        this.tokenExpiry = 0;
    }

    async authenticate() {
        try {
            if (Date.now() > this.tokenExpiry) {
                const data = await this.spotifyApi.clientCredentialsGrant();
                this.spotifyApi.setAccessToken(data.body.access_token);
                this.tokenExpiry = Date.now() + (data.body.expires_in * 1000) - 60000; // Refresh 1 min early
            }
        } catch (error) {
            console.warn('⚠️  Spotify authentication failed, using YouTube only');
            throw new Error('Spotify service unavailable');
        }
    }

    async searchTrack(query) {
        try {
            await this.authenticate();
            
            const results = await this.spotifyApi.searchTracks(query, { limit: 1 });
            
            if (!results.body.tracks.items.length) {
                throw new Error('No tracks found');
            }

            const track = results.body.tracks.items[0];
            const searchQuery = `${track.artists[0].name} ${track.name}`;
            
            // Fallback to YouTube
            const youtubeResult = await YouTubeSearch.search(searchQuery);
            
            return {
                ...youtubeResult,
                originalSource: 'Spotify'
            };
        } catch (error) {
            console.error('❌ Spotify search error:', error);
            throw new Error('Failed to search Spotify track');
        }
    }

    async getPlaylist(playlistId) {
        try {
            await this.authenticate();
            
            const playlist = await this.spotifyApi.getPlaylist(playlistId);
            const tracks = playlist.body.tracks.items;
            
            const songs = [];
            for (const item of tracks.slice(0, 50)) { // Limit to 50 tracks
                if (item.track && item.track.type === 'track') {
                    try {
                        const searchQuery = `${item.track.artists[0].name} ${item.track.name}`;
                        const youtubeResult = await YouTubeSearch.search(searchQuery);
                        songs.push({
                            ...youtubeResult,
                            originalSource: 'Spotify Playlist'
                        });
                    } catch (error) {
                        console.warn(`⚠️  Failed to find YouTube equivalent for: ${item.track.name}`);
                    }
                }
            }
            
            return {
                name: playlist.body.name,
                songs: songs
            };
        } catch (error) {
            console.error('❌ Spotify playlist error:', error);
            throw new Error('Failed to load Spotify playlist');
        }
    }

    static isSpotifyUrl(url) {
        return url.includes('spotify.com/');
    }

    static extractSpotifyId(url) {
        const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
        const playlistMatch = url.match(/playlist\/([a-zA-Z0-9]+)/);
        
        if (trackMatch) return { type: 'track', id: trackMatch[1] };
        if (playlistMatch) return { type: 'playlist', id: playlistMatch[1] };
        
        return null;
    }
}

module.exports = SpotifySearch;