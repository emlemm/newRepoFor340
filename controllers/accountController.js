const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ***************************************
 *  Process Registration
 * ************************************* */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (typeof regResult === 'string') {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  } else {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }
}

/* **************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden' + error)
  }
}

/* *****************************************
 *  Build Account Management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;
    const accountInfoFromDatabase = await accountModel.getAccountByID(accountData.account_id)
    // Render the management page view
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accountInfoFromDatabase.account_firstname,
      accountData,
    })
  } catch (error) {
    // Debugging
    console.error("[CTRL] Error building account management view", error)
    next(error)
  }
};

/* *****************************************
 *  Build Update Account view
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData
    const accountInfoFromDatabase = await accountModel.getAccountByID(accountData.account_id)
    res.render("account/updateAccount", {
      title: "Update Account for " + accountInfoFromDatabase.account_firstname,
      nav,
      errors: null,
      accountData:accountInfoFromDatabase,
    })
  } catch (error) {
    console.error("[CTRL] Error building account update view", error)
    next(error)
  }
};

/* *****************************************
 *  Process update account
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, type, account_id } = req.body

  // if type == password, hash and store password and process with accountmodel
  if (type == "password") {  
    const {account_password} = req.body
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
      console.log(hashedPassword)
      const updatePassword = await accountModel.updatePassword(hashedPassword, account_id)
      if (updatePassword) {
        req.flash("notice", 'Password successfully changed')
        res.status(201).render("account/management", {
          title: "Management",
          nav,
          errors: null,
          account_id,
          account_firstname,
          account_lastname,
          account_email
        })
      } 
    } 
    catch (error) {
      req.flash("notice", 'Sorry, there was an error with your password while updating your account. ' + error)
      res.status(500).render("account/management", {
        title: "Management",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  }
  // if type == info, accountModel update account
  else if (type == "info") {
    try {
      const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
      )
      req.flash("notice", `Congratulations, you\'ve updated your account.`)
      req.flash("notice", `First name: ${updateResult.account_firstname}`)
      req.flash("notice", `Last name: ${updateResult.account_lastname}`)
      req.flash("notice", `Email: ${updateResult.account_email}`)
      res.status(201).render("account/management", {
        title: "Management",
        nav,
        errors: null,
        account_id,
        account_firstname: updateResult.account_firstname,
        account_lastname: updateResult.account_lastname,
        account_email: updateResult.account_email
      })
    }
    catch (error) {
      req.flash("notice", "Sorry, the account update has failed. " + error.message)
      res.status(501).render("account/updateAccount", {
        title: "Update Account of " + account_firstname,
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  }
}

/* *****************************************
 *  Process logout
 * *************************************** */
async function processLogout(req, res) {
  res.clearCookie('jwt')
  res.redirect('/')
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  processLogout
}
