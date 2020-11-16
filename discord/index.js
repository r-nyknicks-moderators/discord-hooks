const { NodeJSBot } = require("nodejsdiscordbot");

const KnicksDiscordBot = new NodeJSBot(process.env.BOT_PREFIX);

const initialiseBot = async (token) => {
    KnicksDiscordBot.once("ready", () => {
        KnicksDiscordBot.commandCollection.loadCommands(process.cwd() + "/discord/commands");
        console.log("Discord Bot ready...");
    });

    return await KnicksDiscordBot.initialise(token);
}

initialiseBot(process.env.BOT_TOKEN);

module.exports = {
    KnicksDiscordBot
};
