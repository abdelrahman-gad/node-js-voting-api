const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

require('dotenv').config();

const { MONGOURI } = require('./../config/keys'); 

//connect to database
//  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.8lvjm.mongodb.net/${process.env.MONGO_DB_DATABASE}`
mongoose.connect(
   MONGOURI,
  {
      useNewUrlParser:true,
      useUnifiedTopology:true,
      useCreateIndex:true
  }
).then( () => {
  console.log('database  connection ok');
}).catch(err=>console.log('connection error'));


// const mongodbUrl = ''; // TODO: PUT YOUR VALID MONGODB CONNECTION URL HERE <-

// if (!mongodbUrl) {
//   console.log('\x1b[33m%s\x1b[0m','Please set the mongodb connection first in -> "server/models/mongo.config.js"\n');
//   return;
// }

//mongoose.connect(mongodbUrl);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to Database Video Requests');
});

module.exports = mongoose;
