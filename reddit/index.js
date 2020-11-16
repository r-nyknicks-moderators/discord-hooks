const snoowrap = require('snoowrap');
const { KnicksDiscordBot } = require("../discord");

// const { fireNewReportHook } = require('../discord');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const subreddit = process.env.SUBREDDIT;

//Temporary until db is running
const linksList = [
  "twitter.com"
]
const BAD_SOURCE_FLAIR_ID = "c714d6ce-25ee-11eb-8a01-0e3bb7b07d89";

const reddit = new snoowrap({
  userAgent: 'knicksbot',
  clientId,
  clientSecret,
  refreshToken,
});


/**
 *
 * @param {string} url - Url to be checked against mongodb list
 * @returns {boolean} - The boolean value of whether or not the link is allowed
 */
const checkLink = async(url) => {
  //linksCollection = await connectToDatabase("disallowed_links");
  //linksList await linksCollection.distinct("domain");

  let domain = new URL(url).hostname
  if (linksList.includes(domain)) return false;
  return true;
}

const checkForNewReports = async (modqueue) => {
  return modqueue.forEach(async (reported_item) => {
    const isSubmission = Boolean(reported_item.comments);

    //Run checks on submissions
    if (isSubmission) {
      let linkAllowed = await checkLink(reported_item.url);
      // Assign bad source flair to invalid sources
      if (!linkAllowed) {
        debugger;
        reported_item.selectFlair({flair_template_id: BAD_SOURCE_FLAIR_ID})
        KnicksDiscordBot.channels.cache.get(process.env.BOT_SEND_CHANNEL)
        .send({"embed": {
          title:"Bad source found",
          url: `https://reddit.com${reported_item.permalink}`,
          description: "A post with a bad source has been reported",
          fields: [{
            name: "Url reported:",
            value: reported_item.url
          }],
          timestamp: new Date()
        }});
      }    
    }

  });
}


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
