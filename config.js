require('dotenv').config();

module.exports = {
    token: process.env.token,
    tokenLocal: process.env.tokenLocal,
    weatherToken: process.env.weatherToken,
    publickey: process.env.publickey,
    isLocal: process.env.isLocal,
    apiLocalUrl: "http://localhost:5001/",
    apiRealUrl: "https://lcpbot.carvalholuigi25.repl.co/"
};