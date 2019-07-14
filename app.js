const axios = require('axios');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const server = require('./server');
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

const MM_APIKEY = '9509cfa377ac07aeed2fe269e231d71d';
const YT_APIKEY = 'AIzaSyAiTtt1rhNQDmmIUnmq1aH-iN0GvpIrJHo';
var filteredResults;

hbs.registerHelper('list', (items, options) => {
  items = filteredResults;
  var out ="";

  const length = items.length;

  for(var i=0; i<length; i++){
    out = out + options.fn(items[i]);
  }

  return out;
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home.hbs');
});

app.post('/gettracks',(req, res) => {
  const artist = req.body.artistname;
  const track = req.body.trackname;
  const trackReq =`http://api.musixmatch.com/ws/1.1/track.search?q_track=${track}&q_artist=${artist}&page_size=1&page=1&s_track_rating=desc&apikey=${MM_APIKEY}`;

  axios
    .get(trackReq)
    .then((response) => {

      filteredResults = extractData(response.data.message.body.track_list);
      
      server
      .saveData(filteredResults);

      const trackData = {
        id: response.data.message.body.track_list[0].track.track_id
      }

      lyricsReq = `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackData.id}&apikey=${MM_APIKEY}`;

      return axios.get(lyricsReq);
    })
    .then(response => {
      const lyricsData = {
        lyrics: response.data.message.body.lyrics.lyrics_body
      }

      server.updateLyricsData(lyricsData.lyrics);
    })
      
    .catch((error) => {
      console.log(error);
    });

    axios
    .get(trackReq)
    .then((response) => {
      const trackData = {
        yt_artist: response.data.message.body.track_list[0].track.artist_name,
        yt_track: response.data.message.body.track_list[0].track.track_name
      }

      videoReq = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${trackData.yt_artist}%20${trackData.yt_track}&type=video&key=${YT_APIKEY}`;

      return axios.get(videoReq);
    })
    .then(response => {
      const videoData = {
        video: response.data.items[0].id.videoId
      }

      server.updateVideoData(videoData.video).then((result) => {
        res.render('result.hbs');
      }).catch((errorMessage) => {
        console.log(errorMessage);
      });
    })
      
    .catch((error) => {
      console.log(error);
    });
  })

app.get('/history', (req, res) => {
  server.getAllData().then((result) => {
    filteredResults = result;
    console.log(filteredResults[0]);
    res.render('history.hbs');
  }).catch((errorMessage) =>{
    console.log(errorMessage);
  });
});

app.post('/delete', (req, res) => {
  server.deleteAll().then((result) => {
    filteredResults = result;
    res.render('history.hbs');
  }).catch((errorMessage) => {
    console.log(errorMessage);
  });
})

const extractData = (originalResults) => {
  var placesObj = {
    table : [],
  };
      tempObj = {
        artist: originalResults[0].track.artist_name,
        track: originalResults[0].track.track_name,
        album: originalResults[0].track.album_name,
        lyrics: '',
        youtube: ''
      }
      placesObj.table.push(tempObj);

    return placesObj.table;
  };



app.listen(port, () =>{
  console.log(`Server started on port ${port}`)
});