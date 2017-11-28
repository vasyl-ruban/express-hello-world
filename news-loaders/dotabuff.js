const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");

const dotabuffFeedUrl = 'http://www.dotabuff.com/blog';

const getTitle = (listItem) => listItem.querySelector('.headline').textContent;
const getId = (listItem) => getLink(listItem).replace('http://www.dotabuff.com/blog/', '');
const getLink = (listItem) => 'http://www.dotabuff.com' + listItem.parentElement.getAttribute('href');

async function getPageDom(pageUrl) {
  let req = await fetch(pageUrl);
  let page = await req.text();
  page = new JSDOM(page);

  return page.window.document;
}

async function getFeed() {
  let feedPage = await getPageDom(dotabuffFeedUrl);
  let newsNodes = feedPage.querySelectorAll('.related-post');

  return [].map.call(newsNodes, (node) => ({
    id: getId(node),
    title: getTitle(node),
    link: getLink(node)
  }));
}

module.exports = {
  getFeed
};
