const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const {  
  VoiceConnectionStatus, joinVoiceChannel, createAudioPlayer, 
  createAudioResource, AudioPlayerStatus, StreamType, 
  NoSubscriberBehavior 
} = require("@discordjs/voice");
const {QueryType} = require('discord-player');
const radio = require('discord-radio-player');

function playmyradio(streamUrl, interaction) {
    const connection = joinVoiceChannel(
    {
        channelId: interaction.member.voice.channel,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const myplayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    let res = createAudioResource(streamUrl, {
      inputType: StreamType.Opus,
      inlineVolume: true,
      metadata: {
        title: 'Radio',
      },
    });

    res.volume.setVolume(1);
    myplayer.play(res);

    connection.subscribe(myplayer);

    console.log('Resource object: \r\n');
    console.log(res);
    console.log('\r\n----------------------------------\r\n');
    console.log('MyPlayer object: \r\n');
    console.log(myplayer);

    connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
      console.log('Connection is in the Ready state!');
    });

    myplayer.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing! (Url: '+streamUrl+')');
      interaction.followUp({
        content: `The audio player has started playing!`,
      });
    });

    myplayer.on(AudioPlayerStatus.Buffering, () => {
      console.log('The audio player still buffering...');
      interaction.followUp({
        content: `The audio player still buffering...`,
      });
    });

    myplayer.on(AudioPlayerStatus.Paused, () => {
      console.log('The audio player still paused...');
      interaction.followUp({
        content: `The audio player still paused...`,
      });
    });

    myplayer.on(AudioPlayerStatus.AutoPaused, () => {
      console.log('The audio player still auto paused...');
      interaction.followUp({
        content: `The audio player still auto paused...`,
      });
    });
    
    myplayer.on(AudioPlayerStatus.Idle, () => {
      interaction.followUp({
        content: `The audio player is on state idle!`,
      });

      myplayer.stop();
      myplayer.play(getNextResource());
    });

    myplayer.on('error', error => {
      console.error('Error: ', error.message);
      interaction.followUp({
        content: `Error: ${error.message}`,
      });

      myplayer.stop(true);
      connection.destroy();
    });

    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
      myplayer.stop(true);
      connection.destroy();
    }
}

module.exports = {
  name: 'playradio',
  description: 'Play a radio in your channel! (Work in Progress)',
  options: [
    {
      name: 'searchterm',
      type: ApplicationCommandOptionType.String,
      description: 'The search term (radio url, name, etc...) you want to play',
      required: false,
    },
  ],
  async execute(interaction, player) {
    try {
      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({
          content: 'You are not in a voice channel!',
          ephemeral: true,
        });
      }

      if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
      ) {
        return void interaction.reply({
          content: 'You are not in my voice channel!',
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const qsterm = interaction.options.getString('searchterm');
      const streamUrl = qsterm ? qsterm : "http://media3.mcr.iol.pt/livefm/m80.mp3/icecast.audio";
      
      playmyradio(streamUrl, interaction);
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
