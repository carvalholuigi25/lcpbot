const {Howl, Howler} = require('howler');
const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');

function loadRadio(play = false) {
    var sound = new Howl({
        src: "http://mcrscast1.mcr.iol.pt/comercial.mp3",
        autoplay: false,
        loop: true,
        html5: true,
        format: ["mp3", "mpeg", "opus", "ogg", "oga", "wav", "aac", "caf", "m4a", "m4b", "mp4", "weba", "webm", "dolby", "flac"],
        volume: 1,
        xhr: {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: false
        },
        onload: function(id) {
            console.log(`Radio: Loaded (Id: ${id})!`);
        },
        onloaderror: function(id, err) {
            console.log(`Radio: Unable to load music (Id: ${id})! Reason: ${err}`);
        },
        onplay: function(id) {
            console.log(`Radio: Playing (Id: ${id})!`);
        },
        onplayerror: function(id, err) {
            console.log(`Radio: Unable to play music (Id: ${id})! Reason: ${err}`);
        },
        onmute: function(id) {
            console.log(`Radio: Muted (Id: ${id})!`);
        },
        onpause: function(id) {
            console.log(`Radio: Paused (Id: ${id})!`);
        },
        onstop: function(id) {
            console.log(`Radio: Stopped (Id: ${id})!`);
        },
        onend: function(id) {
            console.log(`Radio: Finished (Id: ${id})!`);
        }        
    });

    if(play) {
        sound.play();
    }

    return sound;
}

module.exports = {
  name: 'radio',
  description: 'Get radio list and plays it',
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
    },
    {
        name: 'play',
        type: ApplicationCommandOptionType.Boolean,
        description: "It will play the radio by the list",
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

    funcs.getData(`http://localhost:3001/api/radio${urlq}`).then(x => {
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

    loadRadio(true);
  },
};
