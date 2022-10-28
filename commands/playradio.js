const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer,  createAudioResource, AudioPlayerStatus, StreamType } = require("@discordjs/voice");
const {QueryType} = require('discord-player');
const radio = require('discord-radio-player');

function playmyradio(streamUrl, interaction, isStop = false) {
    const isDebug = 0;
    const confCon = {
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true
    };

    const connection = joinVoiceChannel(confCon);
    const myplayer = createAudioPlayer();
    const res = createAudioResource(streamUrl, { inlineVolume: true });

    res.volume.setVolume(1);
    myplayer.play(res);
    connection.subscribe(myplayer);

    if(isDebug == 1) {
      console.log('\r\n----------------------------------\r\n');
      console.log('Connection object 1: \r\n');
      console.log(confCon);
      console.log('\r\n----------------------------------\r\n');
      console.log('Connection object 2: \r\n');
      console.log(connection);
      console.log('\r\n----------------------------------\r\n');
      console.log('Resource object: \r\n');
      console.log(res);
      console.log('\r\n----------------------------------\r\n');
      console.log('MyPlayer object: \r\n');
      console.log(myplayer);
      console.log('\r\n----------------------------------\r\n');
    }
    
    myplayer.on(AudioPlayerStatus.Idle, () => {
      console.log('The audio player is still on state idle...');
      
      if(isStop == true) {
        interaction.followUp({
          content: `The audio player has been stopped!`,
        });
      } else {
        interaction.followUp({
          content: `The audio player is still on state idle...`,
        });
      }
    });

    myplayer.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing! (Url: '+streamUrl+')');
      interaction.followUp({
        content: `The audio player has started playing!`,
      });
    });

    myplayer.on(AudioPlayerStatus.Buffering, () => {
      console.log('The audio player is buffering...');
      interaction.followUp({
        content: `The audio player is buffering...`,
      });
    });

    myplayer.on(AudioPlayerStatus.Paused, () => {
      console.log('The audio player has been paused!');
      interaction.followUp({
        content: `The audio player has been paused!`,
      });
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
      ( interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) || 
      isStop == true
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
    {
      name: 'stop',
      type: ApplicationCommandOptionType.Boolean,
      description: 'It stops the radio',
      required: false
    }
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
      const qstop = interaction.options.getBoolean('stop') ? interaction.options.getBoolean('stop') : false;
      const streamUrl = qsterm ? qsterm : "http://media3.mcr.iol.pt/livefm/m80.mp3/icecast.audio";
      
      playmyradio(streamUrl, interaction, qstop);
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
