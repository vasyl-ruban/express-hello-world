const express = require('express');
const router = express.Router();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');
const joindota = require('../news-loaders/joindota');
const dotabuff = require('../news-loaders/dotabuff');

const feedList = [
  {
    feedId: 0,
    feedName: 'joinDOTA',
    loader: joindota,
  },
  {
    feedId: 1,
    feedName: 'dotabuff',
    loader: dotabuff
  },
  // {
  //   feedId: 2,
  //   feedName: 'dota2.ru'
  // },
  // {
  //   feedId: 3,
  //   feedName: 'cyber.sports.ru'
  // },
  // {
  //   feedId: 4,
  //   feedName: 'prodota.ru'
  // }
];

router.get('/feed', function (req, res, next) {
  res.json(feedList);
});

router.get('/feed/:feedId', async function (req, res, next) {
  let feedId = req.params.feedId;
  let feed = feedList[feedId];
  res.json(await feed.loader.getFeed());
});

router.get('/feed/:feedId/:articleId', async function (req, res, next) {
  let feedId = req.params.feedId;
  let articleId = req.params.articleId;
  let feed = feedList[feedId];

  res.send(await feed.loader.getArticle(articleId));
});

module.exports = router;
