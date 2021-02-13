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
  //Set up post vars
  // const isSubmission = Boolean(comments);
  // const reports = user_reports.length + mod_reports.length;
  // const name = author.name;
  // const post = { id, isSubmission, reports}
  // //Update user reports
  // const collection = await client.db(SUBREDDIT).collection('user');
  // const user = await collection.findOne({ name });
  // if (user) {
  //   const dbPost = user.reportedPosts.find( (o, i) => {
  //     if (o.id == id) {
  //       user.reportedPosts[i] = post;
  //       return true;
  //     }
  //   });
  //   if (!dbPost) user.reportedPosts.push(post);
  //   await collection.replaceOne({ name }, user, (err, res) =>
  //     console.log(err, res),
  //   );
  // }
  // else {
  //   const newUser = {
  //     name,
  //     reportedPosts: [ post ]
  //   }
  //   await collection.insertOne(newUser, (err, res) =>
  //     console.log(err, res),
  //   );
  // }
  // return true;
};

const getUser = async (name) => {
  const collection = await client.db(SUBREDDIT).collection('user');
  return await collection.findOne({ name });
};

module.exports = { insertOrUpdateReport, getUser };
