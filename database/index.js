const MongoClient = require('mongodb').MongoClient;
const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME, SUBREDDIT } = process.env;

const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const insertOrUpdateReport = async ({ id, author, isComment }) => {
  await client.connect((err) => {
    const collection = client.db(SUBREDDIT).collection('reports');
    // collection.find({ id }, (err, res) => console.log(res));
    // collection.insertOne({ id, author: author.name, isComment }, (err, res) =>
    //   console.log(err, res),
    // );

    client.close();
  });
};

module.exports = { insertOrUpdateReport };
