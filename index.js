const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server,
});

const postsId = [286428, 288081, 288013, 286430, 288031];

const clients = {};

const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

const sendMessage = () => {
  const random = Math.floor(Math.random() * postsId.length);

  const data = {
    [postsId[random]]: 'Fast Editor',
    288061: 'Slippy Editor',
  };

  Object.keys(clients).map((client) => {
    clients[client].sendUTF(JSON.stringify(data));
  });
};

wsServer.on('request', function (request) {
  var userID = getUniqueID();

  console.log('new connection');
  console.log(new Date());
  console.log(`origin: ${request.origin}`);

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);

  sendMessage();

  setInterval(() => {
    sendMessage();
  }, 3000);

  connection.on('close', () => {
    console.log('connection close');
  });
});