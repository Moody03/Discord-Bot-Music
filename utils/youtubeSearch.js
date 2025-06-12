// ====== utils/youtubeSearch.js ======
// Created by 0xkhass - All Rights Reserved
// YouTube Search Utility

const YouTube = require('youtube-sr').default;
const ytdl = require('ytdl-core');

class YouTubeSearch {
    static async search(query) {
        try {
            // Check if it's already a YouTube URL
            if (ytdl.validateURL(query)) {
                return await this.getVideoInfo(query);
            }

            // Search for the video
            const results = await YouTube.search(query, { limit: 1, type: 'video' });
            
            if (!results || results.length === 0) {
                throw new Error('No results found for your search query.');
            }

            const video = results[0];
            return {
                title: video.title,
                url: video.url,
                duration: video.durationFormatted,
                thumbnail: video.thumbnail.url,
                uploader: video.channel.name
            };
        } catch (error) {
            console.error('❌ YouTube search error:', error);
            throw new Error('Failed to search YouTube. Please try again.');
        }
    }

    static async getVideoInfo(url) {
        try {
            const info = await ytdl.getInfo(url);
            const details = info.videoDetails;
            
            return {
                title: details.title,
                url: details.video_url,
                duration: this.formatDuration(details.lengthSeconds),
                thumbnail: details.thumbnails[0]?.url || null,
                uploader: details.author.name
            };
        } catch (error) {
            console.error('❌ YouTube video info error:', error);
            throw new Error('Failed to get video information.');
        }
    }

    static formatDuration(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

module.exports = YouTubeSearch;
