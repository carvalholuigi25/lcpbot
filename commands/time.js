require('dotenv').config();

const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');
const path = require('path');
const conf = require(path.join(__dirname, '../config.js'));

module.exports = {
  name: 'time',
  description: 'Get the current time list',
  options: [
    {
        name: 'id',
        type: ApplicationCommandOptionType.Integer,
        description: "It will fetch the list by id param",
        required: false
    }
  ],
  execute(interaction, client) {
    const id = interaction.options.getInteger('id') ? interaction.options.getInteger('id') : -1;
    var urlq = ""; var msg = "";  var myres = "";
    var apiurl = process.env.isLocal ? conf.apiLocalUrl : conf.apiRealUrl;

    if(id != -1) {
        urlq = !urlq.includes("?") ? `?id=${id}` : `&id=${id}` ;
    }

    funcs.getData(`${apiurl}/api/time${urlq}`).then(x => {
        myres = JSON.parse(JSON.stringify(x)).time != null ? JSON.parse(JSON.stringify(x)).time : JSON.parse(JSON.stringify(x));
        // console.log(JSON.stringify(myres));

        if(myres != null && myres.length > 0) {
            for(var i = 0; i < myres.length; i++) {
                msg += `
                \nId: ${myres[i].id}
                \nTime: ${myres[i].time} 
                \nFormated Time: ${myres[i].timefrm} 
                \nMy Timezone: ${myres[i].mytimezone} 
                \nMy Timezone Name: ${myres[i].mytimezonename}`;
            }
        } else {
            msg = 'Error: 0 time items data!';
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));
  },
};
