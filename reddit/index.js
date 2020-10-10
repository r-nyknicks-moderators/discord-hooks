const snoowrap = require('snoowrap');
const { client_id, client_secret, username, password } = require('../secrets.json');

const reddit = new snoowrap({
  userAgent: 'knicksbot',
  clientId: client_id,
  clientSecret: client_secret,
  username,
  password,
});

module.exports = {
  reddit
}