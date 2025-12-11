// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountCont = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

//router.get("/",  accountCont.buildLogin);
router.get("/login", utilities.handleErrors(accountCont.buildLogin));
router.get("/register", utilities.handleErrors(accountCont.buildRegister));
//POST 
router.post("/register", 
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountCont.registerAccount)
);

// Process the login attempt
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountCont.accountLogin)
);

// account managment view after successful login
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accountCont.buildAccountManagement)
);

module.exports = router;