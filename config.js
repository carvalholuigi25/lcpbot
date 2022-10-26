require('dotenv').config();

module.exports = {
  token: process.env.token,
  weatherToken: process.env.weatherToken,
  publickey: process.env.publickey,
  apiLocalUrl: "http://localhost:3001/",
  apiRealUrl: "https://lcpbot.carvalholuigi25.repl.co/"
};