var express = require("express");
var router = express.Router();

/* GET person listing. */
router.get("/", function (req, res) {
  // async connection to database
  require("./db").then(function (connection) {
    // query database
    connection.query("SELECT * FROM `Person`", function (
      error,
      results,
      fields
    ) {
      if (error) {
        console.log(error);
        return;
      } else {
        let sendResult =
          "<div style='border:1px solid #666; padding:5px; margin:20px; background-color:#c7f8f9;'><h1>Person Data</h1></div>";
        results.forEach((element) => {
          var singleResult =
            "<div style='border:1px solid #666; padding:10px; margin:20px; background-color:#1716171c;'><h1>ID : " +
            element["id"] +
            "</h1 >" +
            "<h1>First Name :" +
            element["firstname"] +
            "</h1>" +
            "<h1>Last Name :" +
            element["lastname"] +
            "</h1>" +
            "<h1>Email Id :" +
            element["email"] +
            "</h1></div>";
          sendResult += singleResult;
        });
        console.log(sendResult);
        res.send(sendResult);
      }
    });
  });
});

module.exports = router;
