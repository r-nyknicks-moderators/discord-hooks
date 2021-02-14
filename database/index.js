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

const insertOrUpdateReport = async ({
  id,
  author,
  comments,
  user_reports,
  mod_reports,
}) => {
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

const getUser = async (author) => {
  const collection = await client.db(SUBREDDIT).collection('reports');
  return await collection.find({ author });
};

module.exports = { insertOrUpdateReport, getUser };
