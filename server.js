const app = require("express")();
const http = require("http").createServer(app);
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
const isProduction = process.env.NODE_ENV == "production";
const path = process.cwd();
const distPath = `${path}/frontend/dist`;
const EventEmitter = require("events");

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
  console.log(`listening on http://localhost:${port}`);
});

io.sockets.on("connection", (socket) => {
  const eventEmitter = new EventEmitter();

  socket.emit("connected", { id: socket.id });

  socket.on("start-engine", async (params) => {
    socket.engine = require("./libs/bot-engine");
    socket.engine
      .start(eventEmitter, { ...params, socket_id: socket.id })
      .then((client) => {
        socket.client = client;
      });
  });

  [
    "qr-generated",
    "session-updated",
    "token-generated",
    "session-conflict",
  ].map((event) => {
    eventEmitter.on(event, (data) => {
      socket.emit(event, data);
    });
  });
});
