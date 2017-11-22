const wget = require('node-wget');
const fetch = require('node-fetch');
const fs = require('fs');

async function downloadItemImages() {
  let req = await fetch('http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1?key=');
  let items = await req.json();
  items = items.result.items;

  fs.mkdirSync('tmp/items');
  fs.mkdirSync('tmp/items/lg');

  for (let i=0; i<items.length; i++) {
    let item = items[i];
    item.name = item.name.replace('item_', '');

    wget({
      url: `http://cdn.dota2.com/apps/dota2/images/items/${item.name}_lg.png`,
      dest: `./tmp/items/lg/${item.id}.png`
    });
  }
}


downloadItemImages();
