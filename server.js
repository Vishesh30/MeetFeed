var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var router = express.Router();
var appRoutes = require("./app/routes/api")(router);
var uiRoutes = require("./app/routes/ui")(router);
var dbInterface = require("./app/db/dbInterface");
var path = require("path");

var app = express();
var port = process.env.port || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/ui/dist/ui"));
app.use("/api", appRoutes);

//Connect to DB
dbInterface.connectMonogDB();

//Here we can redirect calls to UI folder once we include it.
//Redirect all the request which is not to a valid path to index.html page
app.use(express.static(path.join(__dirname,'ui/public')));
app.set('views', path.join(__dirname, 'ui/pages'));
app.set('view engine', 'ejs');  // Set the view engine to ejs

app.use("", uiRoutes);

//Log to inform the start of sever and port details
app.listen(port, function () {
  console.log("Running the Server on port " + port);
});
