var person = require("./person");
var express = require("express");
var app = express();
app.get("/", person);

app.listen(3000);
module.exports = app;
