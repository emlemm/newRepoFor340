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
  regValidate.passwordRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountCont.registerAccount)
);

// Process the login attempt
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountCont.accountLogin)
);

// account managment views after successful login
router.get("/", //main page after loging in
  utilities.checkLogin,
  utilities.handleErrors(accountCont.buildAccountManagement)
);

// account update view
router.get("/updateAccount",
  utilities.checkLogin,
  utilities.handleErrors(accountCont.buildUpdateAccount)
);

// process update account
router.post("/updateAccount",
 regValidate.updateAccountRules(),
 regValidate.checkAccountUpdateData,
 utilities.handleErrors(accountCont.updateAccount)
)

// process update password
router.post("/updatePassword",
 regValidate.passwordRules(),
 regValidate.checkAccountUpdateData,
 utilities.handleErrors(accountCont.updateAccount)
)
// process logout request
router.get("/logout", utilities.handleErrors(accountCont.processLogout))

module.exports = router;