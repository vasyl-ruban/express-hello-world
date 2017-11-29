const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");
const wget = require('node-wget');

const dotabuffFeedUrl = 'http://www.dotabuff.com/blog';
const dotabuffArticleUrl = 'http://www.dotabuff.com/blog/';

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

async function getArticle(articleId) {
  let page = await getPageDom(dotabuffArticleUrl + articleId);
  let content = page.querySelector('.post');
  return convertArticle(content);
}

module.exports = {
  getFeed,
  getArticle
};

function convertArticle(article) {
  let adBlocks = article.querySelectorAll('.blog-ad');
  adBlocks.forEach((block) => block.remove());
  article.innerHTML += `
    <style>
      .inline-icon {height: 17px;}
    </style>
  `;

  let imgs = article.querySelectorAll('img');
  let rikiImgs = [].filter.call(imgs, (img) => img.getAttribute('src').indexOf('riki') !== -1);
  let rikiImgUrls = rikiImgs.map((img) => img.getAttribute('src'));
  rikiImgs.forEach((img) => {
    let imgUrl = img.getAttribute('src');

    wget({
      url: imgUrl,
      dest: './tasks/tmp/dotabuff/' + getRikiImageId(imgUrl) + '.png'
    });

    img.setAttribute('src', 'http://188.226.147.71:3030/dotabuff/' + getRikiImageId(imgUrl) + '.png');
  });



  article = article.innerHTML.replace(/href\=\"\//g, 'href="http://dotabuff.com/');
  return article;
}

const getRikiImageId = (url) => url.split('/').pop();
