const { reddit: r } = require('./reddit');
const { connectToDatabase } = require('./database');

const start = async () => {  
  await connectToDatabase();
  console.log(await r.getSubreddit('knicklejerk').getModqueue())
}

start();