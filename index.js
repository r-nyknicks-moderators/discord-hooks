const express = require('express');
const dotenv = require('dotenv');
const { KnicksRedditBot } = require('./reddit');
const config = require('./config');

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

//Bot setup
const {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
  subreddit: SUBREDDIT,
  botToken: BOT_TOKEN,
} = process.env;

app.listen(port, async () => {
  const bot = new KnicksRedditBot(
    clientId,
    clientSecret,
    refreshToken,
    subreddit,
    config,
  );
  bot.setUpStreams();
  bot.setUpDiscordBot(botToken);

  console.log('bot is running...');
});
