const snoowrap = require('snoowrap');
const { KnicksDiscordBot } = require("../discord");
const { insertOrUpdateReport } = require('../database');

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

//Temporary until database is set up
const linksList = [

]

/**
 * Function to handle the commands the discord bot is given
 *
 * @param      {Message}  ctx      The context
 * @param      {Array}  args     The arguments
 * @param      {Return value}  result   The result
 * @param      {Command}  command  The command
 */
const handleDiscordCommands = async (ctx, args, result, command) => {
  if (command.name == "delete") {
    return reddit.getSubmission(args[0]).delete();
  }
}

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
      //TODO (Callum) : Check whether flair is already assigned
      let linkAllowed = await checkLink(reported_item.url);
      // Assign bad source flair to invalid sources
      if (!linkAllowed) {
        reported_item.selectFlair({flair_template_id: badSourceFlairID});
        KnicksDiscordBot.channels.cache.get(process.env.BOT_SEND_CHANNEL)
        .send({"embed": {
          title:"Bad source found",
          url: `https://reddit.com${reported_item.permalink}`,
          description: "A post with a bad source has been reported",
          fields: [
          {
            name: "Url reported:",
            value: reported_item.url
          },
          {
            name: "Post ID",
            value: reported_item.id
          }
          ],
          timestamp: new Date(reported_item.created_utc * 1000)
        }});
      }    
    }

  });
}

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

//Set up discord handler
KnicksDiscordBot.commandCollection.on(
  "ran", handleDiscordCommands);


module.exports = {
  reddit,
  startReportScan,
};
