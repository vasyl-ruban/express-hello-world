const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const formatTeamName = (teamName) => teamName.replace('vs.', '').trim();
const firstTeamTag = (teamPage) => formatTeamName(teamPage.querySelector('.widget-matches-opp1').textContent);
const secondTeamTag = (teamPage) => formatTeamName(teamPage.querySelector('.widget-matches-opp2').textContent);
const isPast = (teamPage) => !isLive(teamPage) && !isFuture(teamPage);
const isLive = (teamPage) => !!teamPage.querySelector('.widget-matches-score-live');
const isFuture = (teamPage) => !!teamPage.querySelector('.widget-matches-score-time');
const firstTeamScore = (teamPage) => isPast(teamPage) ? teamPage.querySelectorAll('.widget-matches-score font')[0].textContent : 0;
const secondTeamScore = (teamPage) => isPast(teamPage) ? teamPage.querySelectorAll('.widget-matches-score font')[1].textContent : 0;
const timeToStart = (teamPage) => isFuture(teamPage) ? teamPage.querySelector('.widget-matches-score-time').textContent : null;
const matchPage = (teamPage) => {
  let link = teamPage.querySelector('a').getAttribute('href');
  link = link.split('/');
  return link[link.length - 1];
};

async function getStreamLinks(matchPageUrl) {
  let matchPage = await fetch(`https://www.joindota.com/en/matches/${matchPageUrl}`);
  matchPage = await matchPage.text();
  matchPage = new JSDOM(matchPage).window.document;
  let streams = matchPage.querySelectorAll('.caster');
  let streamersPages = [];
  for(let i=0; i<streams.length; i++) {
    let streamerPage = await fetch(streams[i].getAttribute('href'));
    streamerPage = await streamerPage.text();
    streamerPage = new JSDOM(streamerPage).window.document;

    streamersPages.push({
      streamerName: streamerPage.querySelector('h1').textContent,
      streamLink: streamerPage.querySelector('#live_stream_embed').getAttribute('src'),
      chatLink: streamerPage.querySelector('#live_chat_embed').getAttribute('src')
    });
  }

  return streamersPages;
}

async function matchList(req, res, next) {
  let matchesPage = await fetch("https://www.joindota.com/en/matches");
  matchesPage = await matchesPage.text();
  matchesPage = (new JSDOM(matchesPage)).window.document;

  let matchesBlocks = matchesPage.querySelectorAll('#in_matches_list li');

  let matches = [].map.call(matchesBlocks, (match) => {
    return {
      firstTeamTag: firstTeamTag(match),
      secondTeamTag: secondTeamTag(match),
      firstTeamScore: firstTeamScore(match),
      secondTeamScore: secondTeamScore(match),
      timeTOStart: timeToStart(match),
      isPast: isPast(match),
      isLive: isLive(match),
      isFuture: isFuture(match),
      matchPage: matchPage(match)
    };
  });

  res.json(matches);
}

async function streamList(req, res, next) {
  let streamLinks = await getStreamLinks(req.params.matchUrl);
  res.json(streamLinks);
}

router.get('/', matchList);

router.get('/:matchUrl/streams', streamList);

module.exports = router;
