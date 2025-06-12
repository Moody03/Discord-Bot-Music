// ====== events/ready.js ======
// Created by 0xkhass - All Rights Reserved
// Bot Ready Event

const { REST, Routes } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`🎵 ${client.user.tag} is online and ready to play music!`);

        // Register slash commands
        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log('🔄 Refreshing application (/) commands...');
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );
            console.log('✅ Successfully registered application (/) commands.');
        } catch (error) {
            console.error('❌ Error registering commands:', error);
        }

         // Set bot status
         client.user.setActivity('🎵 Music for everyone!', { type: 'LISTENING' });
    }
};