const { Webhook, MessageBuilder } = require('discord-webhook-node');
const { webhook_url } = require('../secrets.json');

const hook = new Webhook(webhook_url);

const sendHook = async (title, url, fields) => {
    const embed = new MessageBuilder()
      .setTitle(title)
      .setURL(url);

    for (let title in fields) {
        embed.addField(title, fields[title]);
    }

    hook.send(embed);

}

const fireNewReportHook = async (isSubmission, reported_item) => {
  const { permalink, author, title, body } = reported_item;
  const messageText = isSubmission ? title : body;

  sendHook(`${isSubmission ? 'Post' : 'Comment'} Reported`,
   `https://reddit.com${permalink}`, {author.name: messageText})
};

module.exports = {
  fireNewReportHook,
};
