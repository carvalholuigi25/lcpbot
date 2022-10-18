const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');

module.exports = {
  name: 'newsfeeds',
  description: 'Get list of feeds for news',
  options: [
    {
        name: 'id',
        type: ApplicationCommandOptionType.Integer,
        description: 'Search the feed by the id',
        required: false
    },
    {
        name: 'title',
        type: ApplicationCommandOptionType.String,
        description: 'Search the feed by the title',
        required: false
      }
  ],
  execute(interaction, client) {
    const id = interaction.options.getInteger('id');
    const title = interaction.options.getString('title');
    var srchres = ""; var items  = ""; var urlq = ""; 
    var msg = "";

    if(id != null) {
        urlq = !urlq.includes("?") ? `?id=${id}` : `&id=${id}` ;
    }

    if(title != null) {
        urlq = !urlq.includes("?") ? `?title=${title}` : `&title=${title}`;
    }

    funcs.getData(`http://localhost:3001/api/feeds${urlq}`).then(x => {
        srchres = JSON.parse(JSON.stringify(x)).feeds;
        
        if(srchres != null) {
            items = srchres;

            if(items.length > 0) {
                for(var i = 0; i < items.length; i++) {
                    msg += `Id: ${items[i].id} // Name: ${items[i].name} // Url: ${items[i].url}\r\n`;
                }
            } else {
                msg = 'Error: 0 news feeds data!';
            }
        } else {
            msg = 'Error: Cannot fetch news feeds data!';
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));
  },
};
