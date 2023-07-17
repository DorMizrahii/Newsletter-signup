const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const MAILCHIMPAPIKEY = "9708d559047b1a6d57e6565ba31ba140-us21";
const LISTID = "76727d559d";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.Fname;
  const lastName = req.body.Lname;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + LISTID;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    auth: "dor:" + MAILCHIMPAPIKEY,

    // api key
  };
  let responseBody = "";
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      responseBody += data;
    });
    response.on("end", () => {
      console.log(JSON.parse(responseBody));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

//Api Key
//apiKey = "9708d559047b1a6d57e6565ba31ba140-us21"

//List Id
//listid = "76727d559d";
