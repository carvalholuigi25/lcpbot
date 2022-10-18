const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');

module.exports = {
  name: 'news',
  description: 'Get current latest news.',
  options: [
    {
        name: 'id',
        type: ApplicationCommandOptionType.Integer,
        description: 'Search the news by the id',
        required: false
    },
    {
        name: 'title',
        type: ApplicationCommandOptionType.String,
        description: 'Search the news by the title',
        required: false
      },
      {
        name: 'limit',
        type: ApplicationCommandOptionType.Integer,
        description: 'Limit the news by the number',
        required: false
    },
  ],
  execute(interaction, client) {
    const id = interaction.options.getInteger('id') ? interaction.options.getInteger('id') : -1;
    const title = interaction.options.getString('title') ? interaction.options.getString('title') : "";
    const limit = interaction.options.getInteger('limit') ? interaction.options.getInteger('limit') : -1;
    var srchres = ""; var items  = ""; var urlq = ""; 
    var msg = "";

    if(id != -1) {
        urlq = !urlq.includes("?") ? `?id=${id}` : `&id=${id}` ;
    }

    if(title != "") {
        urlq = !urlq.includes("?") ? `?title=${title}` : `&title=${title}`;
    }

    funcs.getData(`http://localhost:3001/api/news${urlq}`).then(x => {
        srchres = JSON.parse(JSON.stringify(x)).rss;
        items = srchres.channel[0].item;

        if(items.length > 0) {
            if(limit != -1) {
                items = items.slice(0, limit);
            }

            for(var i = 0; i < items.length; i++) {
                msg += `${items[i].link[0]} \r\n`;
            }
        } else {
            msg = "Error: 0 news data!";
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));
  },
};