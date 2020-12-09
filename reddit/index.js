const snoowrap = require('snoowrap');
const {
  SubmissionStream,
  CommentStream,
  ModQueueStream,
} = require('snoostorm');
const { KnicksDiscordBot } = require('../discord');
const { insertOrUpdateReport } = require('../database');

const KnicksRedditBot = class KnicksRedditBot extends snoowrap {
  /**
   * Creates a new KnicksRedditBot
   *
   * @param      {string}  clientId                 The client identifier
   * @param      {string}  clientSecret             The client secret
   * @param      {string}  refreshToken             The refresh token
   * @param      {string}  [userAgent="knicksbot"]  The user agent
   */
  constructor(
    clientId,
    clientSecret,
    refreshToken,
    subreddit,
    userAgent = 'knicksbot',
  ) {
    super({
      userAgent,
      clientId,
      clientSecret,
      refreshToken,
    });

    this.subreddit = subreddit;

    //Temporary until database set up
    this._linksList = [];

    //Discord bot setup
    this.discordBot = new KnicksDiscordBot(process.env.BOT_PREFIX);
  }

  /**
   * Sets up the discord bot for the reddit bot to use
   *
   * @param      {String}  The discord bot token
   *
   */
  async setUpDiscordBot(token) {
    this.discordBot.initialise(token);
    this.discordBot.commandCollection.on(
      'ran',
      async (ctx, args, res, command) => {
        await this.handleDiscordCommands(ctx, args, res, command);
      },
    );
    this.discordBot.once('ready', () => {
      this.discordBot.assignSendChannel(process.env.BOT_SEND_CHANNEL);
    });
  }

  /**
   * Set up the snoostorm streams
   *
   */
  async setUpStreams() {
    //Snoostorm streams setup
    this.modQueueStream = new ModQueueStream(this, {
      subreddit: this.subreddit,
      limit: 50,
      pollTime: 2000,
    });
    this.modQueueStream.on('item', async (submission) => {
      await this.checkSubmission(submission);
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
  async handleDiscordCommands(ctx, args, result, command) {
    if (command.name == 'delete') {
      return this.getSubmission(args[0]).delete();
    }
  }

  /**
   * Checks the url against allowed urls
   * @param {string} url - Url to be checked against mongodb list
   * @returns {boolean} - The boolean value of whether or not the link is allowed
   */
  async checkUrl(url) {
    //TODO (Callum) : Add special checking for twitter links
    let domain = new URL(url).hostname;
    if (this._linksList.includes(domain)) return false;
    return true;
  }

  /**
   * Checks all submissions
   *
   * @param      {snoowrap.submission | snoowrap.comment}  reportedItem  The reported item
   */
  async checkSubmission(reportedItem) {
    const isSubmission = Boolean(reportedItem.comments);

    //Run checks on submissions
    if (isSubmission) {
      //TODO (Callum) : Check whether flair is already assigned
      let linkAllowed = await this.checkUrl(reportedItem.url);
      // Assign bad source flair to invalid sources
      if (!linkAllowed) {
        reportedItem.selectFlair({
          flair_template_id: process.env.BAD_SOURCE_FLAIR_ID,
        });
        await this.discordBot.sendReportedPost(reportedItem, 'Disallowed URL');
      }
    }
  }
};

module.exports = {
  KnicksRedditBot,
};
