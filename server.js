var express = require("express");
var app = express();
const cors = require("cors");
const session = require("express-session");
const key = require("./config").db;
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo(session);
const fs = require("fs");
var resumable = require("./resumable-node.js")("./tmp");
const os = require("os");
const formData = require("express-form-data");
const ffmpeg = require("./ffmpegArgs");

app.use(
  cors({
    origin: "URL",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // enable set cookie
    exposedHeaders: ["Content-Disposition"],
  })
);

//Managing sessions
let sessionOptions = {
  name: "SESSID",
  secret: "secret",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 3600000, sameSite: true },
  store: new MongoStore({ url: key }),
};
app.use(session(sessionOptions));

// Host most stuff in the public folder
app.use(express.static(__dirname + "/folder_name_where_file_saved"));

app.get("/", (req, res) => {
  res.send("ok");
});

app.post("/session", (req, res) => {
  req.session.filename = req.body.filename;
  res.status(200).send("ok");
});

// only video
app.get("/onlyvideo", (req, res) => {
  console.log(req.session);
  ffmpeg
    .onlyvideo(req.session.filename)
    .then((response) => {
      console.log("all okay from onlyvideo");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from onlyvideo");
        return res.status(400).send(error);
      }
    });
});
//only audio
app.get("/onlyaudio", (req, res) => {
  ffmpeg
    .onlyaudio(req.session.filename)
    .then((response) => {
      console.log("all okay from onlyaudio");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from onlyaudio");
        return res.status(400).send(error);
      }
    });
});
app.get("/only720", (req, res) => {
  ffmpeg
    .only720(req.session.filename)
    .then((response) => {
      console.log("all okay from only720");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from only720");
        return res.status(400).send(error);
      }
    });
});

app.get("/only540", (req, res) => {
  ffmpeg
    .only540(req.session.filename)
    .then((response) => {
      console.log("all okay from only540");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from only540");
        return res.status(400).send(error);
      }
    });
});

app.get("/only240", (req, res) => {
  ffmpeg
    .only240(req.session.filename)
    .then((response) => {
      console.log("all okay from only240");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from only240");
        return res.status(400).send(error);
      }
    });
});

app.get("/mpdfile", (req, res) => {
  ffmpeg
    .mpdfile(req.session.filename)
    .then((response) => {
      console.log("all okay from mpdfile");
      return res.status(200).send(response);
    })
    .catch((error) => {
      if (error) {
        console.log("error from mpdfile");
        return res.status(400).send(error);
      }
    });
});
//540p
//360p
//mpdfile

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true,
};

app.use(formData.parse(options));

app.post("/upload", function (req, res) {
  // console.log(req.files);
  resumable.post(
    req.body,
    req.files,
    function (status, filename, original_filename, identifier) {
      if (status === "done") {
        var s = fs.createWriteStream(
          "./folder_name_where_file_saved/" + filename
        );
        s.on("finish", function () {
          resumable.clean(identifier);
          res.status(200).send();
        });
        resumable.write(identifier, s, { end: true });
      } else {
        res.status(/^(partly_done|done)$/.test(status) ? 200 : 500).send();
      }
    }
  );
});

app.listen(5000, () => console.log("server started on port 5000"));
