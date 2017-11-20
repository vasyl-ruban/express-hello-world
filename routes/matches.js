const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const formatTeamName = (teamName) => teamName.replace('vs.', '').trim();

class MatchInfo {

  constructor(dom) {
    this.dom = dom;

    console.log('isLive', this.isLive);
    console.log('isFuture', this.isFuture);
    console.log('isPast', this.isPast);
  }

  get firstTeamTag() {
    return formatTeamName(this.dom.querySelector('a .sub:nth-child(1)') && this.dom.querySelector('a .sub:nth-child(1)').textContent);
  }

  get secondTeamTag() {
    return formatTeamName(this.dom.querySelector('a .sub:nth-child(2)') && this.dom.querySelector('a .sub:nth-child(2)').textContent);
  }

  get isPast() {
    return !!this.dom.querySelector('.ticker_score_loss');
  }

  get isLive() {
    return !!this.dom.querySelector('.ticker_score_live');
  }

  get isFuture() {
    return !this.isPast && !this.isLive;
  }
}


async function matchList(req, res, next) {
  let matchesPage = await fetch("https://www.joindota.com/en/matches");
  matchesPage = await matchesPage.text();
  matchesPage = (new JSDOM(matchesPage)).window.document;

  let matchesBlocks = matchesPage.querySelectorAll('.pad .item');

  let matches = [].map.call(matchesBlocks, (match) => {
    match = new MatchInfo(match);
    return {
      team_tag_1: match.firstTeamTag,
      team_tag_2: match.secondTeamTag,
      isPast: match.isPast,
      isLive: match.isLive,
      isFuture: match.isFuture
    };
  });

  res.json(matches);
}

router.get('/', matchList);

module.exports = router;
