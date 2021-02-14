const { Command } = require('nodejsdiscordbot');
const { getUser } = require('../../../database');

module.exports = class GetUser extends Command {
  constructor() {
    super('user', ['name'], ['ADMINISTRATOR']);
  }

  async _run(ctx, args) {
    const user = await getUser(args[0]);
    //TODO(Callum): Parse results
    console.log(user);
    ctx.channel.send(`\`\`\`${JSON.stringify(user)}\`\`\``);
  }
};
