const express = require('express');
const dotenv = require('dotenv');
const { KnicksRedditBot } = require('./reddit');
const config = require('./config');

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

//Bot setup
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  SUBREDDIT,
  BOT_TOKEN,
} = process.env;

app.listen(port, async () => {
  const bot = new KnicksRedditBot(
    CLIENT_ID,
    CLIENT_SECRET,
    REFRESH_TOKEN,
    SUBREDDIT,
    config,
  );
  bot.setUpStreams();
  bot.setUpDiscordBot(BOT_TOKEN);

  console.log('bot is running...');
});
