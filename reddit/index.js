const snoowrap = require('snoowrap');

// const { fireNewReportHook } = require('../discord');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const subreddit = process.env.SUBREDDIT;

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
  console.log(modqueue.length);
};

/**
 * Starts the scan process of checking for new reported items
 */
const startReportScan = () => {
  return new Promise(async (resolve, reject) => {
    const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
    if (modqueue.length > 0) return resolve(await checkForNewReports(modqueue));
    return reject(false);
  });
};

module.exports = {
  reddit,
  startReportScan,
};
