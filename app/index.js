var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var router = express.Router();
var appRoutes = require("./routes/api")(router);
var uiRoutes = require("./ui/routes/uiRoute")(router);
var dbInterface = require("./db/dbInterface");
var path = require("path");
var eventValidator = require("./middleware/EventValidator");
var cfenv  = require('cfenv');

var app = express();
var port = process.env.port || 8080;

var appEnv = cfenv.getAppEnv();

const passport = require('passport');
const { JWTStrategy } = require('@sap/xssec');
const xsenv = require('@sap/xsenv');

// XSUAA Middleware
// passport.use(new JWTStrategy(xsenv.getServices({xsuaa:{tag:'xsuaa'}}).xsuaa));

// app.use(passport.initialize());
// app.use(passport.authenticate('JWT', { session: false }));

// app.use(morgan("dev"));
app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(express.static(__dirname + "/ui/dist/ui"));
// app.use.use(express.methodOverride())
// app.use(eventValidator);
app.use("/api", appRoutes);

//Connect to DB
dbInterface.connectMonogDB(appEnv);

//Here we can redirect calls to UI folder once we include it.
//Redirect all the request which is not to a valid path to index.html page
app.use(express.static(path.join(__dirname, "ui/public")));
app.set("views", path.join(__dirname, "ui/pages"));
app.set("view engine", "ejs"); // Set the view engine to ejs

app.use("/ui", uiRoutes);
app.use("", uiRoutes);

//Log to inform the start of sever and port details
app.listen(port, function () {
  console.log("Running the Server on port " + port);
});