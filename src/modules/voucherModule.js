const { By, Key } = require("selenium-webdriver");
const VOUCHER_ROOT = "/voucher";
const VOUCHER_CREDIT_WITH_INVOICE = "/invoices#CREDITO";
const { BASE_URL_TESTING, BASE_URL_LOCAL, ERROR } = require("../constants");
const {
  sleep,
  printMessage,
  getRandomNum,
  getRandonStore,
} = require("../utils");

const VOUCHER_TYPES = [
  "Contado",
  "Crédito",
  "Crédito 7 días",
  "Crédito 30 días",
];
const VOUCHER_STATUS = ["Borrador", "Confirmado"];

module.exports.createCreditVoucherWithInvoice = async function (
  driver,
  env,
  res
) {
  await sleep();
  res.write(
    printMessage("Ingresando", "Accediendo a la vista de creación de la nota")
  );
  try {
    const status = VOUCHER_STATUS[getRandomNum(VOUCHER_STATUS.length)];
    let envVoucherURL =
      (env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL) +
      VOUCHER_ROOT +
      VOUCHER_CREDIT_WITH_INVOICE;
    await driver.get(envVoucherURL);
    var currentURL = await driver.getCurrentUrl();
    if (currentURL != envVoucherURL) {
      res.write(printMessage("Error", "No se ha podido acceder a la vista"));
      return;
    }
    await sleep();
    res.write(printMessage("Tipo", "Elegiendo tipo de factura"));
    let type = VOUCHER_TYPES[getRandomNum(3)];
    let invoiceTypeInput = await driver.findElement(By.id("invoiceType"));
    await invoiceTypeInput.click();
    await sleep();
    let typeSelected = await driver.findElement(
      By.css("div[title='" + type + "']")
    );
    await typeSelected.click();
    res.write(printMessage(type, "Tomando una factura: " + type));
    await sleep();
    let searchbutton = await driver.findElement(By.css(".ant-btn-default"));
    await searchbutton.click();
    await sleep(5000);
    let rowSelected = await driver.findElements(By.css(".ag-cell"));
    const actions = driver.actions({ async: true });
    res.write(printMessage("Creación", "Ingresando a la vista de creación"));
    await actions.doubleClick(rowSelected[0]).perform();
    await sleep();
    let pencilButton = await driver.findElements(By.css(".ant-btn-icon-only"));
    await pencilButton[0].click();
    await sleep();
    let modalMask = await driver.findElement(By.css("button.ant-modal-close"));
    await modalMask.click();
    await sleep();
    await pencilButton[1].click();
    await sleep();
    let usedInInput = await driver.findElements(By.css("input[type='search']"));
    await usedInInput[0].sendKeys(getRandonStore());
    await usedInInput[0].sendKeys(Key.ENTER);
    await sleep();
    if (usedInInput[1] !== undefined) {
      await usedInInput[1].sendKeys(getRandonStore());
      await usedInInput[1].sendKeys(Key.ENTER);
      await sleep();
    }
    if (status === "Borrador") {
      let savebutton = await driver.findElement(By.css(".ant-btn-default"));
      await savebutton.click();
      await sleep();
    }
    if (status === "Confirmado") {
      let savebutton = await driver.findElements(By.css(".ant-btn-primary"));
      await savebutton[1].click();
      await sleep();
      savebutton = await driver.findElements(By.css(".ant-btn-primary"));
      await savebutton[2].click();
      await sleep();
    }
  } catch (error) {
    console.log(error);
    res.write(printMessage("Error", error, ERROR));
  }
};

module.exports.printVoucher = async function (driver, env, res) {
  await sleep();
  res.write(
    printMessage("Ingresando", "Accediendo a la vista de creación de la nota")
  );
  try {
    let envVoucherURL =
      (env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL) + VOUCHER_ROOT;
    await driver.get(envVoucherURL);
    var currentURL = await driver.getCurrentUrl();
    if (currentURL != envVoucherURL) {
      res.write(printMessage("Error", "No se ha podido acceder a la vista"));
      return;
    }
    await sleep();
    res.write(
      printMessage("Buscando", "Buscando comprobante listo para imprimir.")
    );
    let found = false;
    let existNext = true;
    while (!found && existNext) {
      let printText = await driver.findElements(
        By.xpath("//span[.='Imprimir']")
      );
      if (printText[0] !== undefined) {
        let printBtn = printText[0].findElement(By.xpath("./.."));
        await printBtn.click();
        await sleep();
        let confirmText = await driver.findElement(By.xpath("//span[.='Sí']"));
        let confirmBtn = confirmText.findElement(By.xpath("./.."));
        await confirmBtn.click();
        await sleep();
        let submitBtn = await driver.findElement(
          By.css("button[type='submit']")
        );
        await submitBtn.click();
        await sleep();
        found = true;
      } else {
        let totalPages = await driver.findElement(
          By.css("span[ref='lbTotal']")
        );
        totalPages = await totalPages.getText();
        let currentPage = await driver.findElement(
          By.css("span[ref='lbCurrent']")
        );
        currentPage = await currentPage.getText();
        res.write(printMessage("Paginando", "Pasando a la página " + currentPage));
        if (totalPages === currentPage) {
          existNext = false;
          res.write(printMessage("Fin de página", "Alcanzada la pàgina final"));
        } else {
          let nextText = await driver.findElement(
            By.xpath("//button[.='Next']")
          );
          let nextBtn = nextText.findElement(By.xpath("./.."));
          await nextBtn.click();
          await sleep();
        }
      }
    }
    await sleep();
  } catch (error) {
    console.log(error);
  }
};
