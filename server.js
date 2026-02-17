const express = require("express")
require("dotenv").config()
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()

/* **********************
* Middleware
********************** */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  store: new (require('connect-pg-simple')(session)) ({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/account", require("./routes/accountRoute"))
app.use("/review", require("./routes/reviewRoute"))

const expressLayouts = require("express-ejs-layouts");

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts);
app.set("layout", "./layouts/layout") 

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
* Express Error Handler
* Place after all other middleware
*********************** */
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page."})
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  //if(err.status == 404) { message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav,
    layout: false
  })
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT 
const host = process.env.HOST


app.listen(port, () => {
  console.log(`app listening at http://${host}:${port}`)
})