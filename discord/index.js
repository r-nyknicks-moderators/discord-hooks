const { NodeJSBot } = require('nodejsdiscordbot');

const KnicksDiscordBot = class KnicksDiscordBot extends NodeJSBot {
  /**
   * Creates a new Discord bot
   *
   * @param      {string}  prefix        Bot prefix
   * @param      {Object}  [options={}]  The options for the discord.js client
   */
  constructor(prefix, options = {}) {
    super(prefix, options);
    this.sendChannel = false;
    this.once('ready', () => {
      this.commandCollection.loadCommands(process.cwd() + '/discord/commands');
      console.log('Discord Bot ready...');
    });
  }

  /**
   * Sends a reported post to the channel
   *
   * @param      {snoowrap.Submission}   submission  The reported post
   * @param      {string}   reason                      The reason for report
   * @param      {Channel}   [channel=this.sendChannel]  The channel to send post to
   * @return     {Promise}  { True if successful }
   */
  async sendReportedPost(submission, reason, channel = this.sendChannel) {
    if (!channel) {
      return false;
    }
    console.log('here');

    channel.send({
      embed: {
        title: 'Reported post',
        url: `https://reddit.com${submission.permalink}`,
        description: reason,
        fields: [
          {
            name: 'URL post links to',
            value: submission.url,
          },
          {
            name: 'Post ID',
            value: submission.id,
          },
        ],
        timestamp: new Date(submission.created_utc * 1000),
      },
    });

    return true;
  }

  /**
   *
   * @param      {string}   id      The id of the discord channel
   * @return     {Promise}  { returns the channel }
   */
  async assignSendChannel(id) {
    if (!this.loaded) return false;
    this.sendChannel = this.channels.cache.get(id);
    return this.sendChannel;
  }
};

module.exports = {
  KnicksDiscordBot,
};
