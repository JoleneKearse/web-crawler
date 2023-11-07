const { crawlPage } = require("./crawl.js");
const { sortPages, printReport } = require("./report.js");

async function main() {
  if (process.argv.length < 3) {
    console.error("Please pass the url you want to crawl.");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.error("I'm sorry I can only crawl one site at a time!");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(`Assemblying all the links on ${baseURL}`);

  const currentURL = baseURL;
  const pages = await crawlPage(baseURL, currentURL, {});

  const sortedPages = sortPages(pages);
  printReport(sortedPages);
}

main();
