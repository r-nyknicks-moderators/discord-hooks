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

    //Discord bot setup
    this.discordBot = new KnicksDiscordBot(config.botPrefix);

    this.subreddit = subreddit;

    //Bot config
    this._botConfig = config;

    //Temporary until database set up
    this._linksList = config.unallowedLinks;
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
      this.discordBot.assignSendChannel(this._botConfig.channels.reportChannel);
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
      await this.checkReportedSubmission(submission);
    });

    this.submissionStream = new SubmissionStream(this, {
      subreddit: this.subreddit,
      limit: 50,
      pollTime: 2000,
    });
    this.submissionStream.on('item', async (submission) => {
      await this.checkNewSubmission(submission);
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
    for (let type in this._botConfig.disallowedLinks) {
      for (let link of this._botConfig.disallowedLinks[type].links) {
        if (url.includes(link)) return [false, type];
      }
    }
    return [true, null];
  }

  /**
   * Checks new submissions
   *
   * @param      {snoowrap.Submission}   submission  The submission
   *
   */
  async checkNewSubmission(submission) {
    //Check if source is dissallowed
    const [allowed, linkType] = await this.checkUrl(submission.url);
    if (
      !allowed &&
      submission.link_flair_template_id != this._botConfig.flairs.badSource
    ) {
      await this.discordBot.sendReportedPost(submission, 'Disallowed URL');
      //Deal with post in response to the type of link
      switch (linkType) {
        case 'streams':
          await submission.reply(
            this._botConfig.disallowedLinks[linkType].reply,
          );
          await submission.remove();
          break;
        case 'badSource':
          await submission.selectFlair({
            flair_template_id: this._botConfig.flairs.badSource,
          });
          break;
      }
    }
  }

  /**
   * Checks reported submissions
   *
   * @param      {snoowrap.submission | snoowrap.comment}  reportedItem  The reported item
   */
  async checkReportedSubmission(reportedItem) {
    const isSubmission = Boolean(reportedItem.comments);
    //Run checks on submissions
    if (isSubmission) {
    }
  }
};

module.exports = {
  KnicksRedditBot,
};
