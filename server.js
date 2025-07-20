const http = require("http");
const CONSTANTS = require("./utils/constants.js");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const { PORT, CLIENT, SERVER } = CONSTANTS;

// Create the HTTP server
const server = http.createServer((req, res) => {
  // get the file path from req.url, or '/public/index.html' if req.url is '/'
  const filePath = req.url === "/" ? "/public/index.html" : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = "text/html";
  if (extname === ".js") contentType = "text/javascript";
  else if (extname === ".css") contentType = "text/css";

  // pipe the proper file to the res object
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, "utf8").pipe(res);
});

// Create the WebSocket Server using the HTTP server
const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (socket) => {
  console.log("A new client has connected to the server.");

  socket.on("message", (data) => {
    console.log(data);

    const { type, payload } = JSON.parse(data);

    switch (type) {
      case CLIENT.MESSAGE.NEW_USER:
        const newUserMessage = {
          type: SERVER.BROADCAST.NEW_USER_WITH_TIME,
          payload: {
            username: payload.username,
            time: new Date().toLocaleTimeString(),
          },
        };
        broadcast(JSON.stringify(newUserMessage)); // broadcast to all clients
        break;

      case CLIENT.MESSAGE.NEW_MESSAGE:
        // data already in the correct format
        const parsed = JSON.parse(data);
        parsed.payload.time = new Date().toLocaleTimeString();
        formattedData = JSON.stringify(parsed);
        broadcast(formattedData, socket);
        break;

      default:
        console.log("Unknown message type received: ", type);
        break;
    }
  });
});

// helper function to broadcast messages to all connected clients
function broadcast(data, socketToOmit) {
  // TODO
  // Exercise 8: Implement the broadcast pattern. Exclude the emitting socket!
  wsServer.clients.forEach((connectedSocket) => {
    if (
      connectedSocket.readyState === WebSocket.OPEN &&
      connectedSocket !== socketToOmit
    ) {
      connectedSocket.send(data);
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});
