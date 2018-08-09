const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/frontend/build'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));


app.get('/acolyte', (req, res) => {
  axios.get('https://deathsnacks.com/wf/data/persistenemies.json').then((data) => {
    // console.log(data.data);
    res.send(data.data);
  })
})

io.on('connection', function (socket) {
  setInterval(function () {
    axios.get('https://deathsnacks.com/wf/data/persistenemies.json').then((data) => {
      socket.emit('refresh-acolytes', { data: data.data});
    }).catch((err) => {
      console.log(err);
    })
  }, 30000);
});


server.listen(port, () => {
  console.log(port);
});
