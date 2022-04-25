var express = require("express");
const { SUCCESS, ERROR } = require("../src/constants");
let router = express.Router();
const loginModule = require("../src/modules/loginModule");
const { printMessage, initDriver } = require("../src/utils");

router.post("/login", function (req, res) {
  try {
    initDriver().then((driver) => {
      res.write(printMessage("Inicio", "Iniciando proceso"));
      loginModule
        .doLogin(
          driver,
          req.body.user.trim(),
          req.body.password.trim(),
          req.body.enviroment.trim(),
          res
        )
        .then(() => {
          res.write(printMessage("Fin", "Processo finalizado", SUCCESS));
          res.end();
          driver.quit();
        });
    });
  } catch (error) {
    console.log(error);
    driver.quit();
    res.write(printMessage("Error", error, ERROR));
    res.end();
  }
});

module.exports = router;
