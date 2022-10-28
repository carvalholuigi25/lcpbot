const { ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');
const path = require('path');
const conf = require(path.join(__dirname, '../config.js'));

module.exports = {
  name: 'radio',
  description: 'Get radio list',
  options: [
    {
        name: 'id',
        type: ApplicationCommandOptionType.Integer,
        description: "It will fetch the list by id param",
        required: false
    },
    {
        name: 'title',
        type: ApplicationCommandOptionType.String,
        description: "It will fetch the list by title param",
        required: false
    }
  ],
  execute(interaction, client) {
    const id = interaction.options.getInteger('id') ? interaction.options.getInteger('id') : -1;
    const title = interaction.options.getString('title') ? interaction.options.getString('title') : "";
    const play = interaction.options.getBoolean('play') ? interaction.options.getBoolean('play') : false;
    var urlq = ""; var msg = "";  var myres = "";

    if(id != -1) {
        urlq = !urlq.includes("?") ? `?id=${id}` : `&id=${id}` ;
    }

    if(title != "") {
        urlq += !urlq.includes("?") ? `?title=${title}` : `&title=${title}`;
    }

    funcs.getData(`${conf.apiRealUrl}/api/radio${urlq}`).then(x => {
        myres = JSON.parse(JSON.stringify(x)).radio != null ? JSON.parse(JSON.stringify(x)).radio : JSON.parse(JSON.stringify(x));
        // console.log(JSON.stringify(myres));

        if(myres != null && myres.length > 0) {
            for(var i = 0; i < myres.length; i++) {
                msg += `Id: ${myres[i].id} / Freq: ${myres[i].freq} / Title: ${myres[i].title} / Url: ${myres[i].src} \n`;
            }
        } else {
            msg = 'Error: 0 radio items data!';
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));    
  },
};
