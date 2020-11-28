const snoowrap = require('snoowrap');
const { connectToDataBase } = require('../database');

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
  return new Promise(async (resolve, reject) => {
    console.log(modqueue.length);
    await connectToDataBase()
      .then(() => {
        return resolve(console.log(modqueue[0]));
      })
      .catch((err) => {
        return reject(console.error(err));
      });
  });
};

checkForNewReports.catch((err) => false);

/**
 * Starts the scan process of checking for new reported items
 */
const startReportScan = async () => {
  const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
  if (modqueue.length > 0) return resolve(await checkForNewReports(modqueue));
  return checkForNewReports.catch();
};

module.exports = {
  reddit,
  startReportScan,
};
