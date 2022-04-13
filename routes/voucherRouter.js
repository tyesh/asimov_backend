var express = require('express');
const { ERROR } = require('../src/constants');
let router = express.Router();
const loginModule = require('../src/modules/loginModule');
const voucherModule = require("../src/modules/voucherModule");
const CREATE_VOUCHER_CREDIT_WITH_INVOICE_ROUTE = "/test-create-voucher-credit-invoice";
const { initDriver, printMessage } = require('../src/utils');

router.post(CREATE_VOUCHER_CREDIT_WITH_INVOICE_ROUTE, function(req, res){
    try {
        initDriver().then((driver) => {
            res.write(printMessage("Inicio", "Iniciando proceso"));
            loginModule.doLogin(driver, req.body.user.trim(), req.body.password.trim(), req.body.enviroment.trim(), res)
            .then((loginRes) => {
                if(loginRes.success) {
                    voucherModule.createCreditVoucherWithInvoice(driver, req.body.enviroment.trim(), res)
                    .then(() => {
                        res.write(printMessage("Fin", "Processo finalizado", SUCCESS));
                        driver.quit();
                        res.end();
                    });
                } else {
                    driver.quit();
                    res.write(printMessage("Error", "Credenciales incorrectas", ERROR));
                    res.end();
                }
            });
        });
    } catch (error) {
        driver.quit();
        console.log(error);
        res.write(printMessage("Error", error, ERROR));
        res.end();
    }
});

module.exports = router;