/*
This script fetches all reviews, **except comment reviews**, and stores them in a 
json file in the raw-data/ folder. It takes two arguments:
The first argument is the repository for which to do this. (e.g. "mdn/content")
The second argument is the year for which to do this. (e.g. "2023")

Use it like this:

node query-reviews.js mdn/content 2023

It is heavy on the HTTP requests, and can take a long time to run!
*/

const fs = require("fs");

const token = process.env.GITHUB_TOKEN;
const fileName = process.argv[2].replace('/', '-');
const prsFile = `raw-data/${fileName}-prs.json`;
const year = process.argv[3];

if (process.argv[2] === undefined || process.argv[3] === undefined) {
  console.error("Must provide two arguments: repository and year");
  console.error("For example 'node query-reviews.js mdn/content 2023'");
  process.exit(1);
}

async function get(prs, token, startIndex = 0, accumulatedReviews = []) {
  const requestHeaders = {
    Authorization: `token ${token}`,
  };

  for (let i = startIndex; i < prs.length; i++) {
    console.log('Fetching review ' + i + '/' + prs.length);
    const pr = prs[i];
    const r = await fetch(`${pr.url}/reviews`, {
      method: "GET",
      headers: requestHeaders,
    });

    if (r.status === 200) {
      const json = await r.json();
      const prReviews = json.filter((review) => review.state !== "COMMENTED");
      accumulatedReviews.push(...prReviews);
    } else if (r.status === 403) {
      // Handle rate limiting by storing the progress and exiting
      const progress = { startIndex: i };
      fs.writeFileSync("progress.json", JSON.stringify(progress, null, "\t"));
      fs.writeFileSync("accumulated-reviews.json", JSON.stringify(accumulatedReviews, null, "\t"));
      console.log("Rate limited. Stopping and saving progress.");
      process.exit(1);
    }
  }

  return accumulatedReviews;
}

const prJSON = fs.readFileSync(prsFile, "utf8");
const prs = JSON.parse(prJSON);

// Check for previous progress
let startIndex = 0;
if (fs.existsSync("progress.json")) {
  const progressJSON = fs.readFileSync("progress.json", "utf8");
  const progress = JSON.parse(progressJSON);
  startIndex = progress.startIndex;
}

// Check for previous accumulated reviews
let accumulatedReviews = [];
if (fs.existsSync("accumulated-reviews.json")) {
  const accumulatedReviewsJSON = fs.readFileSync("accumulated-reviews.json", "utf8");
  accumulatedReviews = JSON.parse(accumulatedReviewsJSON);
}

// get only PRs merged in this time period
const filteredPRs = prs.filter((pr) => {
  if (pr.merged_at) {
    return year === pr.merged_at.slice(0, 4);
  }
  return false;
});

// Get reviews and accumulate them
get(filteredPRs, token, startIndex, accumulatedReviews)
  .then((accumulatedReviews) => {
    // Write the final result to a file
    const reviewsFile = `raw-data/${fileName}-reviews-${year}.json`;
    fs.writeFileSync(reviewsFile, JSON.stringify(accumulatedReviews, null, "\t"));
    fs.writeFileSync("progress.json", JSON.stringify({ startIndex: 0 }, null, "\t"));
    console.log("All reviews saved to ", reviewsFile);
  })
  .catch((error) => console.error("Error:", error));
