const { Command } = require('nodejsdiscordbot');
const { getUser } = require('../../../database');

module.exports = class GetUser extends Command {
  constructor() {
    super('user', ['name'], ['ADMINISTRATOR']);
  }
  //Fetches all user reports and info
  async _run(ctx, args) {
    const user = await getUser(args[0]);
    //Set up all posts
    var posts = [];
    for (let post of user) {
      posts.push({
        name: `https://reddit.com/${post.id}`,
        value: `Reports: ${post.reports}`,
      });
    }
    //Send as formatted message
    ctx.channel.send({
      embed: {
        title: user[0].author,
        url: `https://reddit.com/u/${user[0].author}`,
        description: 'Users reported posts:',
        fields: posts,
      },
    });
  }
};
