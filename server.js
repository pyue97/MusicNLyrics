const {MongoClient} = require('mongodb');
const fs = MongoClient;

const database = 'mongodb+srv://jenniferlurvs:23021997@cluster0-0n3ci.mongodb.net/304cem?retryWrites=true&w=majority';
const appname = '304cem';
const collectionname = 'trackCollection';

const saveData = (newdata) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err,client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      const db = client.db(appname);

      db.collection(collectionname).insertOne(newdata[0], (err, result) => {
          if (err) {
            reject('unable to insert');
          }
          else {
            console.log('Data inserted');
          }
      });
      resolve(1);

      client.close();
    });
  });
};

const updateLyricsData = (updatelyrics) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err,client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      const db = client.db(appname);
      
      var myquery = { lyrics: "" };
      var newvalues = { $set: { lyrics: updatelyrics } };
      db.collection(collectionname).updateOne(myquery, newvalues, (err, result) => {
          if (err) {
            reject('unable to insert');
          }
          else {
            console.log('Lyric updated');
          }
      });
      resolve(1);

      client.close();
    });
  });
};

const updateVideoData = (updateyt) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err,client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      const db = client.db(appname);
      
      var myquery = { youtube: "" };
      var newvalues = { $set: { youtube: updateyt } };
      db.collection(collectionname).updateOne(myquery, newvalues, (err, result) => {
          if (err) {
            reject('unable to insert');
          }
          else {
            console.log('Video id updated');
          }
      });
      resolve(1);

      client.close();
    });
  });
};

const getAllData = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err,client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      const db = client.db(appname);

      db.collection(collectionname).find().toArray().then( (docs) => {
        resolve(docs);
      }, (err) => {
        reject('Unable to fetch docs');
      });

      client.close();
    });
  });
};

const deleteAll = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(database, {useNewUrlParser: true}, (err,client) => {
      if (err) {
        reject('Unable to connect to MongoDB');
      }

      console.log('Connected to MongoDB');
      const db = client.db(appname);

      db.collection(collectionname).remove({}).then( (result) => {
        resolve(result);
      }, (err) => {
        reject('Unable to delete');
      });

      client.close();
    });
  });
};

module.exports = {
  saveData,
  updateLyricsData,
  updateVideoData,
  getAllData,
  deleteAll,
}
