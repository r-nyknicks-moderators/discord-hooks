const snoowrap = require('snoowrap');
const { connectToDatabase, closeConnection } = require('../database');
const { fireNewReportHook } = require('../discord');
const {
  client_id,
  client_secret,
  username,
  password,
  subreddit,
} = require('../secrets.json');

const reddit = new snoowrap({
  userAgent: 'knicksbot',
  clientId: client_id,
  clientSecret: client_secret,
  username,
  password,
});

/**
 *
 * @param {object} collection - Database Collection
 * @param {boolean} isSubmission - The boolean value of whether or not the reported item is a submission or comment
 * @param {object} newReport - Reported Item Information
 */
const insertReportedItem = async (collection, isSubmission, reportData) => {
  const { id, author, permalink } = reportData;
  let success = false;
  try {
    await fireNewReportHook(isSubmission, reportData);
    success = true;
  } catch (error) {
    success = false;
  }
  // Throw new item in the DB
  return await collection.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        _id: id,
        author: author.name,
        permalink,
        isSubmission,
        messageSent: success,
      },
    },
    { upsert: true },
  );
};

/**
 *
 * @param {array} modqueue - Array of items that need to be moderated
 */
const checkForNewReports = async (modqueue) => {
  const collection = await connectToDatabase('reported_items');
  return modqueue.forEach(async (reported_item) => {
    // Changing reported ID key to be _id to match MongoDB value
    const { id: _id } = reported_item;
    const isSubmission = Boolean(reported_item.comments);
    const foundReportedItem = await collection.findOne({ _id });

    // Check if the item exists. If it does not, send message and add it
    if (!Boolean(foundReportedItem))
      return await insertReportedItem(collection, isSubmission, {
        ...reported_item,
      });
    // If it does exist, maybe it missed a message so we have to send a new one and update the object
    if (Boolean(foundReportedItem) && !foundReportedItem.messageSent) {
      return await insertReportedItem(collection, isSubmission, {
        ...reported_item,
      });
    }

    // if reported item is already in the database and sent, just ignore and move on
    return;
  });
};

/**
 * Starts the scan process of checking for new reported items
 */
const startReportScan = async () => {
  const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
  if (modqueue.length > 0) return await checkForNewReports(modqueue);
  return console.log('nothing there. Script complete');
};

module.exports = {
  reddit,
  startReportScan,
};
