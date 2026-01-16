// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://syedtahatest:test@cluster0.h6eik86.mongodb.net/casesDB?retryWrites=true&w=majority&appName=Cluster0"
//   )
//     .then((client) => {
//       console.log("Connected to MongoDB!");
//       _db = client.db();
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;
