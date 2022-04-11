var express = require('express');
let router = express.Router();
const loginModule = require('../src/modules/loginModule');
const voucherModule = require("../src/modules/voucherModule");
const CREATE_VOUCHER_CREDIT_WITH_INVOICE_ROUTE = "/test-create-voucher-credit-invoice";
const { errorMessage, initDriver } = require('../src/utils');

router.post(CREATE_VOUCHER_CREDIT_WITH_INVOICE_ROUTE, function(req, res){
    try {
        initDriver().then((driver) => {
            loginModule.doLogin(driver, req.body.user.trim(), req.body.password.trim(), req.body.enviroment.trim(), res)
            .then((loginRes) => {
                if(loginRes.success) {
                    voucherModule.createCreditVoucherWithInvoice(driver, req.body.enviroment.trim(), res)
                    .then(() => {
                        driver.quit();
                        res.end();
                    });
                } else {
                    driver.quit();
                    res.write(errorMessage("Credenciales incorrectas"));
                    res.end();
                }
            });
        });
    } catch (error) {
        driver.quit();
        console.log(error);
        res.write(errorMessage(error));
        res.end();
    }
});

module.exports = router;