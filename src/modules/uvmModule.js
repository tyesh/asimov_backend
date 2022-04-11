const {Builder, By, Key, util} = require("selenium-webdriver");
const SUPPLIER_ROOT = "/supplier";
const SUPPLIER_NAME_PREFIX = "B.";
const constants = require("../constants");
const utils = require("../utils");
const axios = require('axios');

async function searchArticleSupplier(driver, env="local") {
    let envSupplieruRL = env === "testing" ? constants.BASE_URL_TESTING + SUPPLIER_ROOT : constants.BASE_URL_LOCAL + SUPPLIER_ROOT;
    await driver.get(envSupplieruRL);
    await utils.sleep(constants.waitTimeInMs);

    return {"success": false, "error": "error", message: "error"};
}

exports.createArticleSupplier = async function createArticleSupplier(res, env="local") {
    try {
        res.write("Obteniendo nombre de prueba...");
        axios.get(constants.RANDOM_WORD_API)
        .then(resp => {
            resp = resp.data;
            let supplierName = SUPPLIER_NAME_PREFIX + resp[0] + " " + resp[1];
            res.write("Nombre de prueba: " + supplierName);
            //let driver = await new Builder().forBrowser(contants.BROWSER).build();
            
            res.end();
        })
        .catch((error) => {
            if (error.response) {
                res.json({"success": false, "error": error.response.status, message: error.response.statusText});
                res.end();
            }
        });
    } catch (error) {
        res.json({"success": false, "error": error, message: ""});
        res.end();;
    }
}