const { NodeJSBot } = require("nodejsdiscordbot");

const KnicksDiscordBot = new NodeJSBot(process.env.BOT_PREFIX);

module.exports = {
    KnicksDiscordBot
};
