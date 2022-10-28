const {Client, Collection, GatewayIntentBits, Partials} = require('discord.js');

module.exports = class extends Client {
  constructor(config) {
    super({
      intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.MessageContent
      ],
    });

    this.commands = new Collection();

    this.config = config;
  }
};