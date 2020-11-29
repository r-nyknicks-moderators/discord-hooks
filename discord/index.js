const { NodeJSBot } = require('nodejsdiscordbot');

const KnicksDiscordBot = class KnicksDiscordBot extends NodeJSBot {
  constructor(prefix, options = {}) {
    super(prefix, options);
    this.once('ready', () => {
      this.commandCollection.loadCommands(process.cwd() + '/discord/commands');
      console.log('Discord Bot ready...');
    });
  }
};

module.exports = {
  KnicksDiscordBot,
};
