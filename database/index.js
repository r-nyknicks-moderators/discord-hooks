require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME, SUBREDDIT } = process.env;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//Connection has to stay open otherwise JS gets upset
client.connect();

//TODO(Callum): check for connection before running

/**
 * Add or change a reported post in the mongodb
 *
 * @param      {snoowrap.Submission}   Reported post              The argument 1
 * @param      {string}   post.id            The identifier
 * @param      {string}   post.author        The author
 * @param      {string}   post.comments      The comments
 * @param      {Array}   post.user_reports  The user reports
 * @param      {Array}   post.mod_reports   The modifier reports
 * @return     {boolean}  { true on complete }
 */
const insertOrUpdateReport = async ({
  id,
  author,
  comments,
  user_reports,
  mod_reports,
}) => {
  //setup vars
  const isSubmission = Boolean(comments);
  const reports = user_reports.length + mod_reports.length;
  const collection = client.db(SUBREDDIT).collection('reports');
  //Overwrite old entries
  await collection.deleteMany({ id });
  await collection.insertOne(
    { id, author: author.name, isSubmission, reports },
    (err, res) => console.log(err, res),
  );
  return true;
};

/**
 * Gets the users posts from the db
 *
 * @param      {string}  author  The author
 * @return     {Array}  The users posts.
 */
const getUser = async (author) => {
  const collection = await client.db(SUBREDDIT).collection('reports');
  return await collection.find({ author }).toArray();
};

module.exports = { insertOrUpdateReport, getUser };
