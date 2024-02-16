/*

Metric: Number of merged PRs per PR author

Available filters: year

Example calls:
  - npm run metric-merged-prs mdn/content
  - npm run metric-merged-prs mdn/content 2023

*/

const fs = require("fs");

if (process.argv[2] === undefined) {
  console.error("Must provide at least one arguments: repository ");
  console.error("For example 'npm run metric-merged-prs mdn/content'");
  process.exit(1);
}

const fileName = process.argv[2].replace('/', '-');
const prsFile = `raw-data/${fileName}-prs.json`;
const year = process.argv[3]

function getPRAuthors(json) {
  const prs = json.filter((pr) => pr.merged_at !== null);
  const authors = {};

  for (const pr of prs) {
    if (year) {
      const mergedYear = pr.merged_at.slice(0, 4);
      if (mergedYear !== year) continue;
    }
    if (authors[pr.user.login]) {
      authors[pr.user.login]++;
    } else {
      authors[pr.user.login] = 1;
    }
  }

  return authors;
}

function logAuthors(authors) {
  const sortedAuthors = Object.fromEntries(
    Object.entries(authors).sort(([,a],[,b]) => b-a)
  );
  const authorNames = Object.keys(sortedAuthors);
  for (author of authorNames) {
    console.log(`${author}, ${authors[author]} `);
  }
}

const prJSON = fs.readFileSync(prsFile, "utf8");
const prs = JSON.parse(prJSON);

const authors = getPRAuthors(prs);
logAuthors(authors);
