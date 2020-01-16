import express from "express";
import path from "path";

import RouteList from "./routeList";
import expressStaticGzip from "express-static-gzip";
import cors from "cors";
import bodyParser from "body-parser";
import createError from "http-errors";
import DbConnecter from "./models/DbConnecter";
const logger = require("morgan");

const PORT = process.env.PORT || 12000;
const NODE_ENV = process.env.NODE_ENV;
const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//create a connection to the database
DbConnecter();

//routes
app.use("/api/property", RouteList.Property);

console.log(`Environment is ${NODE_ENV}`);

if (NODE_ENV == "production") {
  app.use(
    expressStaticGzip(path.resolve(__dirname, "./client/build/"), {
      enableBrotli: true,
      customCompressions: [
        {
          encodingName: "deflate",
          fileExtension: "zz"
        }
      ],
      orderPreference: ["br"]
    })
  );
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
  });
}

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ err });
});

app.listen(PORT, () => {
  console.log(`Server is listening on Port ${PORT}`);
});
