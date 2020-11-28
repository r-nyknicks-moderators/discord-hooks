const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const { KnicksRedditBot } = require('./reddit');

const port = process.env.PORT || 5000;

//Bot setup
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const subreddit = process.env.SUBREDDIT;
const badSourceFlairID = process.env.BAD_SOURCE_FLAIR_ID;

const bot = new KnicksRedditBot(clientId, clientSecret, refreshToken, subreddit)
bot.setUpStreams();
bot.setUpDiscordBot(process.env.BOT_TOKEN);

app.listen(port, async () => {
  console.log("bot is running...");
});
