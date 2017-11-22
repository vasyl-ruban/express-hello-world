const wget = require('node-wget');
const fetch = require('node-fetch');
const fs = require('fs');

async function downloadHeroImages() {
  let req = await fetch('http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=');
  heroes = await req.json();
  heroes = heroes.result.heroes;

  fs.mkdirSync('tmp');
  fs.mkdirSync('tmp/heroes');
  fs.mkdirSync('tmp/heroes/sb');
  fs.mkdirSync('tmp/heroes/lg');
  fs.mkdirSync('tmp/heroes/full');

  for (let i=0; i<heroes.length; i++) {
    let hero = heroes[i];
    hero.name = hero.name.replace('npc_dota_hero_', '');

    console.log(hero);
    wget({
      url: `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_sb.png`,
      dest: `./tmp/heroes/sb/${hero.id}.png`
    });
    wget({
      url: `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_lg.png`,
      dest: `./tmp/heroes/lg/${hero.id}.png`
    });
    wget({
      url: `http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name}_full.png`,
      dest: `./tmp/heroes/full/${hero.id}.png`
    });
  }
}


downloadHeroImages();
