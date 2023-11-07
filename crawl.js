const { URL } = require("url");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function normalizeURL(urlEntered) {
  const url = new URL(urlEntered);
  const normalizedPath = url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;
  return `${url.hostname}${normalizedPath}`;
}

function getURLsFromHTML(htmlBody, baseURL) {
  // obtain anchor tags
  const dom = new JSDOM(htmlBody);
  const anchorTags = dom.window.document.querySelectorAll("a");
  // extract the href
  const urlValues = Array.from(anchorTags).map((anchor) => anchor.href);
  const absoluteURLs = urlValues.map((urlValue) => {
    if (urlValue.startsWith("/")) {
      return baseURL + urlValue;
    }
    return urlValue;
  });
  return absoluteURLs;
}

async function crawlPage(baseURL, currentURL, pages) {
  try {
    const response = await fetch(baseURL);
    if (response.status > 399) {
      console.log(`Got HTTP error, status code: ${response.status}`);
      return;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Got non-html response: ${contentType}`);
      return;
    }

    // check currentURL == baseURL, if not return pages
    const baseDomain = new URL(baseURL).hostname;
    const currentDomain = new URL(currentURL).hostname;

    if (baseDomain !== currentDomain) {
      // console.log(
      //   `Skipping ${currentDomain} as it is not on the same domain as ${baseDomain}`
      // );
      return pages;
    }

    // normalize url & add to pages obj
    if (pages.hasOwnProperty(normalizeURL(currentURL))) {
      pages[normalizeURL(currentURL)]++;
      return pages;
    } else {
      if (normalizeURL(currentURL) === normalizeURL(baseURL)) {
        pages[normalizeURL(currentURL)] = 0;
      } else {
        pages[normalizeURL(currentURL)] = 1;
      }
    }
    // fetch the current url
    const currentResponse = await fetch(currentURL);
    const currentHTML = await currentResponse.text();

    // collect all URLs from HTML response body
    const foundURLs = getURLsFromHTML(currentHTML, baseURL);
    // recursively work until pages updated with aggregate count
    for (const url of foundURLs) {
      pages = await crawlPage(baseURL, url, pages);
    }
    // return updated pages object
    // console.log(JSON.stringify(pages));
    return pages;
  } catch (err) {
    console.log(`catch block >>> ${err.message}`);
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
