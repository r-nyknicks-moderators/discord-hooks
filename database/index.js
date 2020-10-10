const { db_url, db_name } = require('../secrets.json');
const { MongoClient } = require('mongodb');

const listDatabases = async (client) => {
  const databaseList = await client.db().admin().listDatabases();
  console.log('Databases');
  databaseList.databases.forEach(db => console.log(db));
}

const connectToDatabase = async () => {
  const uri = `${db_url}/${db_name}`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 
  try {
    await client.connect();
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = { connectToDatabase }