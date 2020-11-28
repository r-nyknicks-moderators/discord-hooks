const snoowrap = require('snoowrap');
const { connectToACollection, insertOrUpdateReport } = require('../database');

const {
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  REFRESH_TOKEN: refreshToken,
  SUBREDDIT: subreddit,
} = process.env;

const reddit = new snoowrap({
  userAgent: 'knicksbot',
  clientId,
  clientSecret,
  refreshToken,
});

/**
 *
 * @param {array} modqueue - Array of items that need to be moderated
 */
const checkForNewReports = async (modqueue) => {
  // console.log(JSON.stringify(modqueue));
  modqueue.forEach(async (report) => {
    console.log(reddit.getUser(report.author.name));
    // await insertOrUpdateReport({
    //   ...report,
    //   isComment: Boolean(report.body),
    // });
  });
};

/**
 * Starts the scan process of checking for new reported items
 */
const startReportScan = async () => {
  return new Promise(async (resolve, reject) => {
    const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
    if (modqueue.length > 0) return resolve(await checkForNewReports(modqueue));
    return reject();
  });
};

module.exports = {
  reddit,
  startReportScan,
};
