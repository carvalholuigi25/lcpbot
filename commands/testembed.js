const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

function getMyEmbed() {
	const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('LCPBot')
	.setURL('https://github.com/carvalholuigi25/lcpbot')
	.setAuthor({ name: 'LCPBot Logo', iconURL: 'https://cdn.discordapp.com/app-icons/1030146199770112092/f5e26a31fdac7147a26874449b11e092.png?size=256', url: 'https://github.com/carvalholuigi25/lcpbot' })
	.setDescription('LCP Bot is a bot for discord, which consists to interact bot within your discord server and provides the commands giving ability to all users, moderators or administrators for execute them, modify them and/or use them on their servers with oauth2 and bearer token access.')
	.setThumbnail('https://cdn.discordapp.com/app-icons/1030146199770112092/f5e26a31fdac7147a26874449b11e092.png?size=256')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://cdn.discordapp.com/app-icons/1030146199770112092/f5e26a31fdac7147a26874449b11e092.png?size=256')
	.setTimestamp()
	.setFooter({ text: 'Created by Luigi Carvalho', iconURL: 'https://cdn.discordapp.com/app-icons/1030146199770112092/f5e26a31fdac7147a26874449b11e092.png?size=256' });

	return exampleEmbed;
}


module.exports = {
  name: 'testembed',
  description: 'Testing and showing the embed panel information in your channel.',
  options: [
    {
      name: 'chname',
      type: ApplicationCommandOptionType.String,
      description: 'Your current channel name visiting at this moment.',
      required: true,
    },
  ],
  execute(interaction, client) {
	  if(!interaction.member.permissions.has('USE_APPLICATION_COMMANDS')) {
  		return interaction.reply("This channel does not have use application commands permission!");
  	}
  
  	if (!interaction.member.permissions.has('EMBED_LINKS')) {
  		return interaction.reply("This channel does not have embed links permission!");
  	}
  
  	const chname = interaction.options.getString('chname') ? interaction.options.getString('chname') : "others";
  	const channel = client.channels.cache.find(ch => ch.name === chname);
  
  	if(channel == null) {
  		return interaction.reply("The channel does not exist.");
  	}
  
  	client.channels.fetch(channel.id).then(ch => {
  		ch.send({ embeds: [ getMyEmbed() ] });
  		interaction.reply({
  			content: `Tested the embed with success!!`,
  			ephemeral: true,
  		});
  	}).catch(err => {
  		console.log(err);
  		interaction.reply({
  			content: `Error while testing the embed...`,
  			ephemeral: true,
  		});
  	});
  },
};