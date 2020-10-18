const snoowrap = require('snoowrap');
const { connectToDatabase } = require('../database');
const { client_id, client_secret, username, password, subreddit } = require('../secrets.json');

const reddit = new snoowrap({
  userAgent: 'knicksbot',
  clientId: client_id,
  clientSecret: client_secret,
  username,
  password,
});


const insertReportedItem = async (collection, insertItem) => {
  await collection.insertOne(insertItem, { forceServerObjectId: false });
}


const checkForNewReports = async (modqueue) => {
  const collection = await connectToDatabase('reported_items');
  modqueue.forEach(async (reported_item) => {
    const { id, author } = reported_item;
    const isSubmission = Boolean(reported_item.comments);
    const isReportInDB = await collection.findOne({ id });
    if(!isReportInDB) await insertReportedItem(collection, { id, author: author.name, isSubmission });
    // if reported item is already in the database, just ignore and move on
    return;
  }); 
}


/**
 * Starts the scan process of checking for new reported items
 * @param {object} client - The Database object
 */
const startReportScan = async () => {
  const modqueue = await reddit.getSubreddit(subreddit).getModqueue();
  if(modqueue.length > 0) await checkForNewReports(modqueue);
  else console.log('No new reports, closing');
}


module.exports = {
  reddit,
  startReportScan
}