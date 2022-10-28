require('dotenv').config();

const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');
const path = require('path');
const conf = require(path.join(__dirname, '../config.js'));

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
    },
    {
        name: 'limit',
        type: ApplicationCommandOptionType.Integer,
        description: 'Limit the news by the number',
        required: false
    },
    {
        name: 'page',
        type: ApplicationCommandOptionType.Integer,
        description: 'Set the page number to paginate your news list',
        required: false
    }
  ],
  execute(interaction, client) {
    const id = interaction.options.getInteger('id') ? interaction.options.getInteger('id') : -1;
    const title = interaction.options.getString('title') ? interaction.options.getString('title') : "";
    const limit = interaction.options.getInteger('limit') ? interaction.options.getInteger('limit') : -1;
    const page = interaction.options.getInteger('page') ? interaction.options.getInteger('page') : 1;
    const apiurl = process.env.isLocal ? conf.apiLocalUrl : conf.apiRealUrl;
    var srchres = ""; var items = ""; var urlq = ""; var msg = "";

    if(id != -1) {
        urlq = !urlq.includes("?") ? `?id=${id}` : `&id=${id}` ;
    }

    if(title != "") {
        urlq += !urlq.includes("?") ? `?title=${title}` : `&title=${title}`;
    }

    if(page != -1) {
        urlq += !urlq.includes("?") ? `?_page=${page}` : `&_page=${page}`;
    }

    if(limit != -1) {
        urlq += !urlq.includes("?") ? `?_limit=${limit}` : `&_limit=${limit}`;
    }

    funcs.getData(`${apiurl}/api/feeds${urlq}`).then(x => {
        srchres = JSON.parse(JSON.stringify(x)).feeds != null ? JSON.parse(JSON.stringify(x)).feeds : JSON.parse(JSON.stringify(x));
        items = srchres;
        // console.log(JSON.stringify(items));

        if(items != null && items.length > 0) {
            for(var i = 0; i < items.length; i++) {
                msg += `Id: ${items[i].id} // Name: ${items[i].name} // Url: ${items[i].url}\r\n`;
            }
        } else {
            msg = 'Error: 0 news feeds data!';
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));
  },
};
