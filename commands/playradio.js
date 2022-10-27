const { GuildMember, ApplicationCommandOptionType } = require('discord.js');
const {  joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require("@discordjs/voice");
const {QueryType} = require('discord-player');
const radio = require('discord-radio-player');

function playmyradio(streamUrl, interaction) {
    const connection = joinVoiceChannel(
    {
        channelId: interaction.member.voice.channel,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const myplayer = createAudioPlayer();

    let res = createAudioResource(streamUrl, {
      inputType: StreamType.Opus,
      inlineVolume: true,
      metadata: {
        title: 'Radio',
      },
    });

    res.volume.setVolume(1);
    myplayer.play(res);

    myplayer.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
      interaction.followUp({
        content: `The audio player has started playing!`,
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

    connection.subscribe(myplayer);

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
