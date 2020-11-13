const sendHook = async (title, url, fields) => {
    const embed = new MessageBuilder()
      .setTitle(title)
      .setURL(url);

    for (let title in fields) {
        embed.addField(title, fields[title]);
    }

    hook.send(embed);

    return true;

}

const fireNewReportHook = async (isSubmission, reported_item) => {
  const { permalink, author, title, body } = reported_item;
  const messageText = isSubmission ? title : body;

  return sendHook(`${isSubmission ? 'Post' : 'Comment'} Reported`,
   `https://reddit.com${permalink}`, {author.name: messageText});
};

module.exports = {
  sendHook,
  fireNewReportHook,
};

