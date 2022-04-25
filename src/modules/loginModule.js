const { By } = require("selenium-webdriver");
const { sleep, printMessage } = require("../utils");
const {
  BASE_URL_TESTING,
  BASE_URL_LOCAL,
  BASE_URL_HOME,
  ACCESS_TOKEN,
  ERROR,
} = require("../constants");
const LOGIN_URL = "/login";
const INPUT_USER = '.login .login-input input[type="text"]';
const INPUT_PASSWORD = '.login .login-input input[type="password"]';
const LOGGIN_BUTTON = '.login button[type="submit"]';

async function isUserLogged(driver, env = "local", res) {
  res.write(printMessage("Comprobando", "Comprobando el estado de la sesión"));
  let envHomeURL = env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL;
  await driver.get(envHomeURL);
  await sleep();
  var currentURL = await driver.getCurrentUrl();
  if (currentURL == LOGIN_URL) {
    res.write(
      printMessage("Error", "Credenciales de usuario incorrectas", ERROR)
    );
    return false;
  }
  return true;
}

async function login(driver, env = "local", user, password, res) {
  res.write(
    printMessage("Ingreso", "Ingresando a la vista de inicio de sesión")
  );
  let envLoginURL =
    (env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL) + LOGIN_URL;
  await driver.get(envLoginURL);
  var userInput = await driver.findElement(By.css(INPUT_USER));
  var passwordInput = await driver.findElement(By.css(INPUT_PASSWORD));
  var inputButton = await driver.findElement(By.css(LOGGIN_BUTTON));
  res.write(printMessage("Credenciales", "Ingresando las crendenciales"));
  await userInput.sendKeys(user);
  await passwordInput.sendKeys(password);
  await sleep();
  await inputButton.click();
  return driver;
}

async function getAccessToken(driver, env = "local", res) {
  res.write(printMessage("Token", "Intentando obtener el token"));
  try {
    let envHomeURL =
      (env === "testing" ? BASE_URL_TESTING : BASE_URL_LOCAL) + BASE_URL_HOME;
    var currentURL = await driver.getCurrentUrl();
    if (currentURL != envHomeURL) {
      res.write(
        printMessage("Error", "Credenciales de usuario incorrectas", ERROR)
      );
      return;
    }
    await driver.executeScript(
      "return window.localStorage.getItem('" + ACCESS_TOKEN + "');"
    );
    res.write(printMessage("Correcto", "Token de usuario obtenido."));
  } catch (error) {
    res.write(printMessage("Error", error, ERROR));
  }
}

module.exports.doLogin = async function makeLogin(
  driver,
  user,
  password,
  env = "local",
  res
) {
  await sleep();
  await login(driver, env, user, password, res);
  await sleep();
  var isLogged = await isUserLogged(driver, env, res);
  if (isLogged) {
    await getAccessToken(driver, env, res);
  }
  await sleep();
  return { success: isLogged };
};
