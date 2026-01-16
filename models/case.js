const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
});

const Case = mongoose.model("Case", caseSchema);
const User = mongoose.model("User", userSchema);
const File = mongoose.model("File", fileSchema);
module.exports = { Case, User, File };

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class Case {
//   constructor(title, description, status = "Open", priority = "Medium", id) {
//     this.title = title;
//     this.description = description;
//     this.status = status;
//     this.priority = priority;
//     this.createdAt = new Date();
//     this.updatedAt = new Date();
//     if (id) {
//       this._id = new mongodb.ObjectId(id);
//     }
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // Update existing case
//       dbOp = db
//         .collection("cases")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Insert new case
//       dbOp = db.collection("cases").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log("Case saved successfully");
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("cases")
//       .find()
//       .sort({ createdAt: -1 })
//       .toArray()
//       .then((cases) => {
//         console.log("Cases fetched successfully");
//         return cases;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static findById(caseId) {
//     const db = getDb();
//     return db
//       .collection("cases")
//       .findOne({ _id: new mongodb.ObjectId(caseId) })
//       .then((caseItem) => {
//         console.log("Case found");
//         return caseItem;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static deleteById(caseId) {
//     const db = getDb();
//     return db
//       .collection("cases")
//       .deleteOne({ _id: new mongodb.ObjectId(caseId) })
//       .then((result) => {
//         console.log("Case deleted");
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }
// }

// module.exports = Case;
