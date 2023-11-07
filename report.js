// const { pages } = require("./main");

function sortPages(pages) {
  // convert to array for softing
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  // sort back into an object
  const sortedPages = {};
  for (const [key, value] of pagesArray) {
    sortedPages[key] = value;
  }
  return sortedPages;
}

function printReport(pages) {
  console.log("Report is starting...");
  for (const [url, count] of Object.entries(pages)) {
    console.log(`Found ${count} internal likes to ${url}`);
  }
}

module.exports = {
  printReport,
  sortPages,
};
