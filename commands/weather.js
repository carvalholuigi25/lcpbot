require('dotenv').config();

const {ApplicationCommandOptionType } = require('discord.js');
const funcs = require('../functions.js');
const path = require('path');
const conf = require(path.join(__dirname, '../config.js'));

module.exports = {
  name: 'weather',
  description: 'Get weather list',
  options: [
    {
        name: 'city',
        type: ApplicationCommandOptionType.String,
        description: 'It will fetch the list by city param',
        required: false
    },
    {
        name: 'state',
        type: ApplicationCommandOptionType.String,
        description: 'It will fetch the list by state param',
        required: false
    },
    {
        name: 'country',
        type: ApplicationCommandOptionType.String,
        description: 'It will fetch the list by country param',
        required: false
    },
    {
        name: 'units',
        type: ApplicationCommandOptionType.String,
        description: 'It will fetch the list by units param',
        required: false
    },
    {
        name: 'lang',
        type: ApplicationCommandOptionType.String,
        description: 'It will fetch the list by lang param',
        required: false
    }
  ],
  execute(interaction, client) {
    const city = interaction.options.getString('city') ? interaction.options.getString('city') : "braga";
    const state = interaction.options.getString('state') ? interaction.options.getString('state') : "";
    const country = interaction.options.getString('country') ? interaction.options.getString('country') : "pt";
    //metric = Celsius, imperial = Fahrenheit, standard = default (imperial)
    const units = interaction.options.getString('units') ? interaction.options.getString('units') : "metric";
    const lang = interaction.options.getString('lang') ? interaction.options.getString('lang') : "pt";
    var urlq = ""; var msg = ""; var myres = "";
    var apiurl = process.env.isLocal ? conf.apiRealUrl : conf.apiLocalUrl;

    if(city != "") {
        urlq = !urlq.includes("?") ? `?city=${city}` : `&city=${city}` ;
    }

    if(state != "") {
        urlq += !urlq.includes("?") ? `?state=${state}` : `&state=${state}`;
    }

    if(country != "") {
        urlq += !urlq.includes("?") ? `?country=${country}` : `&country=${country}`;
    }

    if(units != "") {
        urlq += !urlq.includes("?") ? `?units=${units}` : `&units=${units}`;
    }

    if(lang != "") {
        urlq += !urlq.includes("?") ? `?lang=${lang}` : `&lang=${lang}`;
    }

    funcs.getData(`${apiurl}/api/weather${urlq}`).then(x => {
        myres = JSON.parse(JSON.stringify(x));

        // console.log(JSON.stringify(myres));

        if(myres != null) {
            msg = `\nId: ${myres.id}
            \nName: ${myres.name}
            \nWeather Title: ${myres.weather[0].main}
            \nWeather Description: ${myres.weather[0].description}
            \nCoords Longitude:  ${myres.coord.lon}
            \nCoords Latitude:  ${myres.coord.lat}
            \nTemperature Current: ${myres.main.temp}
            \nTemperature Min: ${myres.main.temp_min}
            \nTemperature Max: ${myres.main.temp_max}
            \nCountry: ${myres.sys.country}
            \nSunrise: ${myres.sys.sunrise}
            \nSunset: ${myres.sys.sunset}
            \nTimezone:  ${myres.timezone}\n`;

            msg = msg.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "");
        } else {
            msg = 'Error: 0 weather data items!';
        }

        interaction.reply({
            content: msg,
            ephemeral: true,
        });
    }).catch(err => console.log(err));
  },
};
