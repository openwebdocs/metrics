/*

Metric: PR reviewers 

Bot reviews are excluded.

Available filters: 
- year
- cohort: 
  - all reviews, or
  - community reviews (excluding PRs authored by core maintainers)

Example calls:
  - npm run metric-reviewers mdn/content 2023
  - npm run metric-reviewers mdn/content 2023 community

*/

const fs = require("fs");

const fileName = process.argv[2].replace('/', '-');
const year = process.argv[3];
const prsFile = `raw-data/${fileName}-prs.json`;
const reviewsFile = `raw-data/${fileName}-reviews-${year}.json`;
const cohortFilter = process.argv[4] || 'all';

if (process.argv[2] === undefined || process.argv[3] === undefined) {
  console.error("Must provide two arguments: repository and year");
  console.error("For example 'npm run metric-reviewers mdn/content 2023'");
  process.exit(1);
}

function getReviewers(json) {

  function isCommunityReview(review) {
    const maintainers = [
      'Elchi3',
      'Guyzeroth',
      'LeoMcA',
      'Rumyra',
      'bsmth',
      'caugner',
      'chrisdavidmills',
      'ddbeck',
      'dipikabh',
      'estelle',
      'fiji-flo',
      'hamishwillee',
      'pepelsbey',
      'queengooborg',
      'rebloor',
      'schalkneethling',
      'teoli2003',
      'wbamberg',
      'zfox23'
    ];

    const pr = prs.find(
      (candidate) => candidate.url === review.pull_request_url
    );

    if (pr) {
      if (!maintainers.includes(pr.user.login)) {
        return true;
      }
    }
    return false;
  }

  const reviewers = {};

  for (const review of json) {
    if (cohortFilter === 'community') {
      if (!isCommunityReview(review)) continue;
    }
    if (!review.submitted_at) continue;
    if (year !== review.submitted_at.slice(0, 4)) continue;
    if (review.user.login === "mdn-bot") continue;
    if (reviewers[review.user.login]) {
      reviewers[review.user.login]++;
    } else {
      reviewers[review.user.login] = 1;
    }
  }

  return reviewers;
}

function logReviewers(reviewers) {
  const sortedReviewers = Object.fromEntries(
    Object.entries(reviewers).sort(([,a],[,b]) => b-a)
  );
  const reviewerNames = Object.keys(sortedReviewers);
  for (reviewer of reviewerNames) {
    console.log(`${reviewer}, ${reviewers[reviewer]} `);
  }
}

const reviewsJSON = fs.readFileSync(reviewsFile, "utf8");
const reviews = JSON.parse(reviewsJSON);

const prsJSON = fs.readFileSync(prsFile, "utf8");
const prs = JSON.parse(prsJSON);

const reviewers = getReviewers(reviews);
logReviewers(reviewers);
