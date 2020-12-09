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
   * @param      {Object} config                    The config of the reddit bot
   * @param      {string}  [userAgent="knicksbot"]  The user agent
   */
  constructor(
    clientId,
    clientSecret,
    refreshToken,
    subreddit,
    config,
    userAgent = 'knicksbot',
  ) {
    super({
      userAgent,
      clientId,
      clientSecret,
      refreshToken,
    });

    this.subreddit = subreddit;

    //Bot config
    this._config = config;

    //Temporary until database set up
    this._linksList = config.unallowedLinks;

    //Discord bot setup
    this.discordBot = new KnicksDiscordBot(config.botPrefix);
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
      this.discordBot.assignSendChannel(
        this._config.channels.reportChannel);
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
   * @param {string} url - Url to be checked
   * @returns {boolean} - The boolean value of whether or not the link is allowed
   */
  async checkUrl(url) {
    for (link in this._config.unallowedLinks) {
      if (url.includes(link)) return false;
    }
    return true
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
          flair_template_id: this._config.flairs.badSource,
        });
        await this.discordBot.sendReportedPost(reportedItem, 'Disallowed URL');
      }
    }
  }
};

module.exports = {
  KnicksRedditBot,
};
