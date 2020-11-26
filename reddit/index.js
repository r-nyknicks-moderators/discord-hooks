const snoowrap = require('snoowrap');
const { SubmissionStream, CommentStream, ModQueueStream } = require("snoostorm");
const { KnicksDiscordBot } = require("../discord");

const KnicksRedditBot = class KnicksRedditBot extends snoowrap {
 /**
  * Constructs a new instance.
  *
  * @param      {string}  clientId                 The client identifier
  * @param      {string}  clientSecret             The client secret
  * @param      {string}  refreshToken             The refresh token
  * @param      {string}  [userAgent="knicksbot"]  The user agent
  */
  constructor (clientId, clientSecret, refreshToken, subreddit, userAgent = "knicksbot") {
    super({
      userAgent,
      clientId,
      clientSecret,
      refreshToken
    });

    //Temporary until database set up
    this._linksList = []

    //Discord bot setup
    this.discordBot = new KnicksDiscordBot(process.env.BOT_TOKEN);
    this.discordBot.initialise(process.env.BOT_TOKEN);
    this.discordBot.commandCollection.on(
      "ran", this.handleDiscordCommands);

    //Snoostorm streams setup
    this.modQueueStream = new ModQueueStream(this, {
      subreddit,
      limit: 50,
      pollTime: 2000
    });
    this.modQueueStream.on("item", (submission) => {
      this.checkSubmission(submission);
    });

  }

  /**
   * Function to handle the commands the discord bot is given
   *
   * @param      {Message}  ctx      The context
   * @param      {Array}  args     The arguments
   * @param      {Return value}  result   The result
   * @param      {Command}  command  The command
   */
  handleDiscordCommands(ctx, args, result, command) {
    if (command.name == "delete") {
      return reddit.getSubmission(args[0]).delete();
    }
  }

  /**
   * Checks the url against allowed urls
   * @param {string} url - Url to be checked against mongodb list
   * @returns {boolean} - The boolean value of whether or not the link is allowed
   */
  checkUrl(url) {
    //TODO (Callum) : Add special checking for twitter links
    let domain = new URL(url).hostname
    if (this._linksList.includes(domain)) return false;
    return true;
  }

  /**
   * Checks all submissions
   *
   * @param      {snoowrap.submission | snoowrap.comment}  reportedItem  The reported item
   */
  checkSubmission(reportedItem) {
    const isSubmission = Boolean(reportedItem.comments);

      //Run checks on submissions
    if (isSubmission) {
      //TODO (Callum) : Check whether flair is already assigned
      let linkAllowed = this.checkUrl(reportedItem.url);
      // Assign bad source flair to invalid sources
      if (!linkAllowed) {
        reportedItem.selectFlair({flair_template_id: process.env.BAD_SOURCE_FLAIR_ID});
        this.discordBot.channels.cache.get(process.env.BOT_SEND_CHANNEL)
        .send({"embed": {
          title:"Bad source found",
          url: `https://reddit.com${reportedItem.permalink}`,
          description: "A post with a bad source has been reported",
          fields: [
          {
            name: "Url reported:",
            value: reportedItem.url
          },
          {
            name: "Post ID",
            value: reportedItem.id
          }
          ],
          timestamp: new Date(reportedItem.created_utc * 1000)
        }});
      }    
    }    
  }
}


module.exports = {
  KnicksRedditBot
}