const fetch = require("node-fetch");

async function getData(url = 'http://localhost:3001/api/playlist') {
    const response = await fetch(url, {
      method: 'GET', 
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });

    return response.json();
}

module.exports = { getData };