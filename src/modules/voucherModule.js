const { By, Key } = require("selenium-webdriver");
const VOUCHER_ROOT = "/voucher";
const VOUCHER_CREDIT_WITH_INVOICE = "/invoices#CREDITO";
const { BASE_URL_TESTING, BASE_URL_LOCAL, SMALLPROCESS_TIME } = require("../constants");
const { sleep, printMessage, errorMessage, endPrintMessages } = require("../utils");

const VOUCHER_TYPES = ["Contado", "Crédito", "Crédito 7 días", "Crédito 30 días"];

module.exports.createCreditVoucherWithInvoice = async function(driver, env, res) {
    await sleep();
    res.write(printMessage("Ingresando", "Accediendo a la vista de creación de la nota", SMALLPROCESS_TIME));
    try {
        let envVoucherURL = (env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL) + VOUCHER_ROOT + VOUCHER_CREDIT_WITH_INVOICE;
        await driver.get(envVoucherURL);
        var currentURL = await driver.getCurrentUrl();
        if(currentURL != envVoucherURL){
            res.write(printMessage("Error", "No se ha podido acceder a la vista", SMALLPROCESS_TIME));
            return;
        }
        await sleep();
        res.write(printMessage("Tipo", "Elegiendo tipo de factura", SMALLPROCESS_TIME));
        let type = VOUCHER_TYPES[Math.floor(Math.random() * 3)];
        let invoiceTypeInput = await driver.findElement(By.id("invoiceType"));
        await invoiceTypeInput.click();
        await sleep();
        let typeSelected = await driver.findElement(By.css("div[title='" + type + "']"));
        await typeSelected.click();
        res.write(printMessage(type, "Tomando una factura: " + type, SMALLPROCESS_TIME));
        await sleep();
        let searchbutton = await driver.findElement(By.css(".ant-btn-default"));
        await searchbutton.click();
        await sleep(5000);
        let rowSelected = await driver.findElements(By.css(".ag-cell"));
        const actions = driver.actions({async: true});
        res.write(printMessage("Creación", "Ingresando a la vista de creación", SMALLPROCESS_TIME));
        await actions.doubleClick(rowSelected[0]).perform();
        await sleep();
        let taxNumberInput = await driver.findElement(By.css("input[type='text']"));
        await taxNumberInput.sendKeys(Math.floor(Math.random() * 999999));
        await taxNumberInput.sendKeys(Key.ENTER);
        await sleep();
        let pencilButton = await driver.findElements(By.css(".ant-btn-icon-only"));
        await pencilButton[0].click();
        await sleep();
        let usedInInput = await driver.findElement(By.css("input[type='search']"));
        await usedInInput.sendKeys("Central de Distribución");
        await usedInInput.sendKeys(Key.ENTER);
        await sleep();
        let savebutton = await driver.findElement(By.css(".ant-btn-default"));
        await savebutton.click();
        await sleep();
        let ticketNumber = await driver.findElement(By.css(".ant-modal-confirm-title"));
        ticketNumber = await ticketNumber.getAttribute("innerHTML");
        res.write(printMessage("Exito", ticketNumber, SMALLPROCESS_TIME));
        await sleep();
        res.write(endPrintMessages());
        await sleep();
    } catch (error) {
        console.log(error);
        res.write(errorMessage(error))
    }
};