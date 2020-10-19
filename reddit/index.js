const snoowrap = require('snoowrap');
const { connectToDatabase, closeConnection } = require('../database');
const { fireNewReportHook } = require('../discord');
const { client_id, client_secret, username, password, subreddit } = require('../secrets.json');

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
const insertReportedItem = async (collection, isSubmission, newReport) => {
  const { id, author, permalink } = newReport;
  // Throw new item in the DB
  await collection.insertOne({ _id: id, author: author.name, permalink, isSubmission }, { forceServerObjectId: false });
  // Send discord message that it's a newly reported item
  return fireNewReportHook(isSubmission, newReport);
}

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
    const isReportInDB = await Boolean(collection.findOne({ _id }));
    if(!isReportInDB) await insertReportedItem(collection, isSubmission, { ...reported_item });
    // if reported item is already in the database, just ignore and move on
    return console.log('modqueue filled with old reports');
  }); 
}


/**
 * Starts the scan process of checking for new reported items
 */
const startReportScan = async () => {
  const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
  if(modqueue.length > 0) await checkForNewReports(modqueue);
  return console.log('nothing there. Script complete');
}


module.exports = {
  reddit,
  startReportScan
}