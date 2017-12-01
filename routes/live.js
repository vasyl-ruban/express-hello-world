const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

async function getMatches() {
  let liveGames = await fetch('http://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1?key=28C65034DDA8DA73DB5BCF2D2D9078A1');
  liveGames = await liveGames.json();
  return liveGames.result;
}

router.get('/', async function (req, res, next) {
 let liveGames = await getMatches();
 liveGames.games.sort((a, b) => b.spectators - a.spectators);
 liveGames = liveGames.result.games.slice(0, 10);
 res.json(liveGames);
});

router.get('/:matchId', async function (req, res, next) {
  let matchId = req.params.matchId;
  let liveGames = await getMatches();
  let game = liveGames.games.find((game) => game.match_id == matchId);
  res.json(game);
});
module.exports = router;
