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
   * @return     {Promise}  { description_of_the_return_value }
   */
  async sendReportedPost(submission, reason, channel = this.sendChannel) {
      if (!channel) {
          return false;
      }

      channel.send({
          embed: {
              title: "Reported post",
              url: `https://reddit.com${submission.permalink}`,
              description: reason,
              fields:[
                  {
                      name: "URL post links to",
                      value: submission.url
                  },
                  {
                      name: "Post ID",
                      value: submission.id
                  }
              ],
              timestamp: new Date(submission.created_utc * 1000)
          }
      });

  }

  async assignSendChannel(id) {
      this.sendChannel = this.channels.cache.get(id);
      return this.sendChannel;
  }
};

module.exports = {
  KnicksDiscordBot,
};
