const { db_url, subreddit } = require('../secrets.json');
const { MongoClient } = require('mongodb');


const connectToDatabase = async (collectionName) => {
  const uri = `${db_url}/${subreddit}`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
  console.log(`\n ========= OPENING CONNECTION ========= \n`)
  try {
    await client.connect();
    return await client.db(subreddit).collection(collectionName);
  } catch(e) {
    console.error(e);
    await client.close();
  }
}

module.exports = { connectToDatabase }