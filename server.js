const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app); // inicia o servidor utilizando o protocolo http
const io = require('socket.io')(server); // inicia o protocolo WSS (websocket)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (request, response) => {
  response.render('index.html');
});

let messages = [];

io.on('connection', socket => {
  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  })
})

server.listen(3000);