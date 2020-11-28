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

// const config = {
//   schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
//   sync: {
//     user: users.getAuthedUser(),
//     partitionValue: partitionKey,
//   },
// };

const writeSomething = ({ comment_id, username }) => {
  Realm.write(() =>
    realmApp.create('Reported_Comment', {
      _id: new BSON.ObjectId(),
      comment_id: comment_id,
      username: username,
    }),
  );
};

module.exports = { connectToDataBase, writeSomething };
