const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const VideoRequestData = require('./data/video-requests.data');
const multer = require('multer');
const UserData = require('./data/user.data');
const cors = require('cors');
const mongoose = require('./models/mongo.config');
const { query } = require('express');
const videoRequestsData = require('./data/video-requests.data');

const { MONGOURI , CLIENT_URL } = require('./config/keys'); 

console.log(MONGOURI);

// configure dotenv file
require('dotenv').config();

console.log('client url:',CLIENT_URL);


if (!Object.keys(mongoose).length) return;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));


// app.all('*', function(req, res, next){
//     console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
    
//     res.redirect('http://'+req.hostname + ':' + app.get('port') + req.url);
// });



app.get('/', (req, res) =>
  res.send('Welcome to gad academy APIs, use /video-request to get data')
);

const upload = multer();
app.post('/video-request', upload.none() , async (req, res, next) => {
  const response = await VideoRequestData.createRequest(req.body);
  res.send(response);
  next();
});

app.get('/video-request', async (req, res, next) => {
  
  const {sortBy , searchTerm  , filterBy } = req.query;
  //console.log(sortBy);
  let data;
  if(searchTerm){
    data = await videoRequestsData.searchRequests(searchTerm,filterBy);
  }else{
    data = await VideoRequestData.getAllVideoRequests(filterBy);
  }

    if(sortBy === 'topVotedFirst'){
      data = data.sort( (prev , next) =>{
       if(
        prev.votes.ups.length - prev.votes.downs.length >
        next.votes.ups.length - next.votes.downs.length 
       ){
        return -1
        }else{
        return 1;
        }
      });    
    }
    //console.log(data);

   res.send(data);
   next();
});

app.get('/users', async (req, res, next) => {
  const response = await UserData.getAllUsers(req.body);

  res.send(response);
  next();
});

app.post('/users/login', async (req, res, next) => 
{
  const response = await UserData.createUser(req.body);
  console.log(response._id);
  res.redirect(`${process.env.CLIENT_URL}?id=${response._id}`);
  next();
});


app.use(express.json());
app.put('/video-request/vote', async (req, res, next) => {
  const { id, vote_type  , user_id } = req.body;
  // console.log(req.body);
 // console.log(id, vote_type , user_id);
  const response = await VideoRequestData.updateVoteForRequest(id, vote_type, user_id);
  res.send(response.votes);
  next();
});

app.put('/video-request', async (req, res, next) => {
  const { id, status, resVideo } = req.body;
  const response = await VideoRequestData.updateRequest(id, status, resVideo);
  res.send(response);
  next();
});

app.delete('/video-request', async (req, res, next) => {
  const response = await VideoRequestData.deleteRequest(req.body.id);
  res.send(response);
  next();
});

console.log(process.env.PORT);
app.listen(process.env.PORT, () =>
  console.log(`Native js app listening at :${process.env.PORT}`)
);
