require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
const port = 3070;
const isProduction = process.env.NODE_ENV == "production";
const path = process.cwd();
const distPath = `${path}/frontend/dist`;

app.use(bodyParser.json());
if (isProduction) {
  app.use(express.static(distPath));
}

app.get("/", (req, res) => {
  if (isProduction) {
    return res.sendFile(`${distPath}/index.html`);
  }
  res.send(
    "the server is in development mode, to generate the interface run frontend: npm run build and server: npm run start"
  );
});

app.get("/api", (req, res) => {
  res.json("api is running ...");
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
