const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const request = require("request");

const port = 3000;
const hostname = "localhost";
app.use(bodyParser.json());
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("MPESA DARAJA API WITH NODE JS BY UMESKIA SOFTWARES");
  //TIME STAMP FORMART YEAR+MONTH+DATE+HOUR+MINUTE+SECOND
  var date = new Date();
  var month = date.getMonth() + 1;
  let timestamp =
    date.getFullYear() +
    "" +
    "" +
    month +
    "" +
    "" +
    date.getDate() +
    "" +
    "" +
    date.getHours() +
    "" +
    "" +
    date.getMinutes() +
    "" +
    "" +
    date.getSeconds();
  console.log(timestamp);
});

//ACCESS TOKEN
app.get("/access_token", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});

//TRIGER AN STK PUSH
app.get("/stkpush", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const url =
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + accessToken;
      var date = new Date();
      var month = date.getMonth() + 1;
      let timestamp =
        date.getFullYear() +
        "" +
        "" +
        month +
        "" +
        "" +
        date.getDate() +
        "" +
        "" +
        date.getHours() +
        "" +
        "" +
        date.getMinutes() +
        "" +
        "" +
        date.getSeconds();
      const password = new Buffer.from(
        "174379" +
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
          timestamp
      ).toString("base64");

      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: "1",
            PartyA: "254768168060",
            PartyB: "174379",
            PhoneNumber: "254768168060",
            CallBackURL: "https://umeskiasoftwares.com/umswifi/callback",
            AccountReference: "Test",
            TransactionDesc: "Umeskia Pay",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            console.log(
              "😀 Please enter mpesa pin to complete the transaction"
            );
            res.status(200).json(body);
          }
        }
      );
    })
    .catch(console.log);
});

//REGISTER URL FOT C2B

app.get("/registerurl", (req, resp) => {
  getAccessToken()
    .then((accessToken) => {
      let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
      let auth = "Bearer " + accessToken;

      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            ShortCode: "600383",
            ResponseType: "Complete",
            ConfirmationURL: "http://example.com/confirmation",
            ValidationURL: "http://example.com/validation",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          }
          resp.status(200).json(body);
        }
      );
    })
    .catch(console.log);
});

app.post("/confirmation", (req, res) => {
  console.log("All transaction  will be send to this url");
  console.log(req.body);
});

app.post("/validation", (req, resp) => {
  console.log("Validating payment");
  console.log(req.body);
});
//STIMUTATE TRANSACTION TO SEE IF URL IS REGISTERED SUCCESSULY
app.get("/simulate", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
      let auth = "Bearer " + req.access_token;

      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            ShortCode: "600383",
            CommandID: "CustomerPayBillOnline",
            Amount: "100",
            Msisdn: "254708374149",
            BillRefNumber: "TestAPI",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            res.status(200).json(body);
          }
        }
      );
    })
    .catch(console.log);
});

// END OF C2B AND REGITER URL WITH NODE JS

//GETING ACCESS TOKEN FUNCTION
function getAccessToken() {
  const consumer_key = "TWCjG1tc4iXI3TQRgzUdVnkpXmR5G65z";
  const consumer_secret = "n9xef6W6IGuww6uL";
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  return new Promise((response, reject) => {
    request(
      {
        url: url,
        headers: {
          Authorization: auth,
        },
      },
      function (error, res, body) {
        var jsonBody = JSON.parse(body);
        if (error) {
          reject(error);
        } else {
          const accessToken = jsonBody.access_token;
          response(accessToken);
        }
      }
    );
  });
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
