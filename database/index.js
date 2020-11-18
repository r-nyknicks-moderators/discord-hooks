const { BSONType } = require('mongodb');
const Realm = require('realm');

const realmApp = new Realm.App({ id: 'reddit-reports-xbjra' });

const CommentSchema = {
  name: 'Reported_Comment',
  properties: {
    _id: 'objectId',
    _partition: 'string?',
    comment_id: 'string?',
    username: 'string?',
  },
};

const connectToDataBase = async () => {
  const credentials = Realm.Credentials.anonymous();
  await realmApp.logIn(credentials);
  return await Realm.open({
    schema: [CommentSchema],
    sync: {
      user: realmApp.currentUser,
      partitionValue: 'myPartition',
    },
  });
};

const writeSomething = (text) => {
  Realm.write(() => {
    const newTask = realmApp.create('Reported_Comment', {
      _id: new BSON.ObjectId(),
      name: 'go shopping',
      status: 'open',
    });
  });
};

module.exports = { connectToDataBase };
