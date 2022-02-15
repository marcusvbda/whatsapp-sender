const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
app.use(cors());
const botEngine = require("./libs/bot-engine");
const bodyParser = require("body-parser");
const isProduction = process.env.NODE_ENV == "production";
const path = process.cwd();
const distPath = `${path}/frontend/dist`;
const EventEmitter = require("events");
const sessions = {};
const debug = require("console-development");

const io = require("socket.io")(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(bodyParser.json());

if (isProduction) {
  app.use(express.static(distPath));
}

app.get("/", (req, res) => {
  res.json("api is running ...");
});

const port = 3000;
http.listen(port, () => {
  debug.log(`listening on http://localhost:${port}`);
});

io.sockets.on("connection", (socket) => {
  const eventEmitter = new EventEmitter();

  socket.emit("connected", { id: socket.id });

  socket.on("start-engine", async (params) => {
    let isConnected = false;
    if (
      sessions[params.session_id] &&
      sessions[params.session_id]?.isConnected
    ) {
      isConnected = await sessions[params.session_id].isConnected();
    }

    if (isConnected) {
      socket.emit("session-updated", {
        statusSession: "isLogged",
        session: params.session_id,
      });
    } else {
      botEngine
        .start(eventEmitter, {
          ...params,
          headless: isProduction,
          socket_id: socket.id,
        })
        .then((client) => {
          sessions[params.session_id] = client;
        });
    }
  });

  [
    "qr-generated",
    "session-updated",
    "token-generated",
    "incoming-call",
    "state-change",
  ].map((event) => {
    eventEmitter.on(event, (data) => {
      socket.emit(event, data);
    });
  });

  eventEmitter.on("browser-close", (session) => {
    socket.emit("browser-close", session);
    delete sessions[session];
  });
});
