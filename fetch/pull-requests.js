/*
This script fetches **all** PRs of a given repo and stores them in a json file
in the raw-data/ folder. The first argument is the repository's location. 

Use it like this:

node fetch/pull-requests.json mdn/content
*/

const fs = require("fs");

const repo = process.argv[2];
const token = process.env.GITHUB_TOKEN;

const startURL = `https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`;

function getNextURL(link) {
  const bits = link.split(",").map((bit) => bit.trim());
  const next = bits.find((bit) => bit.split(";")[1] === ' rel="next"');
  if (next) {
    return next.split(";")[0].slice(1, -1);
  }
  return null;
}

function showProgress(link) {
  const bits = link.split(",").map((bit) => bit.trim());
  const last = bits.find((bit) => bit.split(";")[1] === ' rel="last"');
  const next = bits.find((bit) => bit.split(";")[1] === ' rel="next"');
  if (last) {
    const lastPage = last.split('&page=')[1].split('>')[0];
    const currentPage = next.split('&page=')[1].split('>')[0];
    return `${currentPage}/${lastPage}`;
  } else {
    return '';
  }
}

let all = [];
let progress = '';

async function get(url, token) {
  const requestHeaders = {
    Authorization: `token ${token}`,
  };
  
  console.log("Fetching", progress, url);

  const r = await fetch(url, { method: "GET", headers: requestHeaders });
  const json = await r.json();
  all = all.concat(json);

  const link = r.headers.get("Link");
  const next = getNextURL(link);
  progress = showProgress(link);
  
  if (next) {
    get(next, token);
  } else {
    const fileName = `raw-data/${repo.replace('/', '-')}-prs.json`;
    fs.writeFileSync(fileName, JSON.stringify(all, null, "\t"));
  }
}

get(startURL, token);