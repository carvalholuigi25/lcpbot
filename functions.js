const fetch = require("node-fetch");

async function getData(url = 'http://localhost:3001/api/playlist', mimeTypeFrm = 'json') {
    const getheaders = mimeTypeFrm == "json" ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'application/xml' };

    const response = await fetch(url, {
      method: 'GET', 
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: getheaders,
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });

    const resp = mimeTypeFrm == "json" ? response.json() : response.text();
    return resp;
}

module.exports = { getData };