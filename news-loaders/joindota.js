const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");

const joindotaFeedUrl = 'http://joindota.com/en/news/archive';
const joindotaArticleUrl = 'http://joindota.com/en/news/';

const getTitle = (listItem) => listItem.querySelectorAll('.sub')[1].textContent;
const getDate = (listItem) => listItem.querySelectorAll('.sub')[0].textContent;
const getId = (listItem) => getLink(listItem).replace('https://www.joindota.com/en/news/', '');
const getLink = (listItem) => listItem.getAttribute('href');

async function getPageDom(pageUrl) {
  let req = await fetch(pageUrl);
  let page = await req.text();
  page = new JSDOM(page);

  return page.window.document;
}

async function getFeed() {
  let feedPage = await getPageDom(joindotaFeedUrl);
  let newsNodes = feedPage.querySelectorAll('#content .list_item');

  return [].map.call(newsNodes, (node) => ({
    id: getId(node),
    title: getTitle(node),
    date: getDate(node),
    link: getLink(node)
  }));
}

async function getArticle(articleId) {
  let page = await getPageDom(joindotaArticleUrl + articleId);
  let article = page.querySelector('#content .pad');
  console.log(joindotaArticleUrl + articleId);
  return article.innerHTML;
}

const joindotaLoader = {
  getFeed,
  getArticle
};


module.exports = joindotaLoader;
