const { Webhook, MessageBuilder } = require('discord-webhook-node');
const { webhook_url } = require('../secrets.json');

const hook = new Webhook(webhook_url);

const fireNewReportHook = async (isSubmission, reported_item) => {
  const { permalink, author, title, body } = reported_item;
  const messageText = isSubmission ? title : body;

  const embed = new MessageBuilder()
    .setTitle(`${isSubmission ? 'Post' : 'Comment'} Reported`)
    .setURL(`https://reddit.com${permalink}`)
    .addField(author.name, messageText);

  console.log(embed);
  // hook.send(embed);
};

module.exports = {
  fireNewReportHook,
};
