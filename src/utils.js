const { Builder } = require("selenium-webdriver");
const { BROWSER, WAITTIMEINMS, IN_PROGRESS, STORES } = require("./constants");

exports.sleep = (waitTimeInMs = WAITTIMEINMS) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

exports.printMessage = (stage = "", message = "", status = IN_PROGRESS) => {
    let messObj = {stage: stage, message: message, status: status, datetime: new Date()}; 
    console.log("📗" + JSON.stringify(messObj));
    return JSON.stringify(messObj);
};

exports.initDriver = async () => {
    let driver = await new Builder().forBrowser(BROWSER).build();
    return driver;
};

exports.getRandomNum = limit => {
    return Math.floor(Math.random() * limit);
};

exports.getRandonStore = () => {
    const rIndex = this.getRandomNum(STORES.length);
    return STORES[rIndex];
};