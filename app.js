const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const moment = require("moment");

const port = 3000;
const hostname = "localhost";
app.use(bodyParser.json());
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("MPESA DARAJA API WITH NODE JS BY UMESKIA SOFTWARES");
  var timeStamp = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
