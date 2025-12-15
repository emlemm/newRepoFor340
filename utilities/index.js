const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inv-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="classification">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

/* **************************************
* Build the vehicle data view HTML
* ************************************ */
Util.buildVehicleDataGrid = async function(data) {
  let grid
  if (data.length > 0) {
    data = data[0];
    let mileage = data.inv_miles
    mileageCommas = mileage.toLocaleString('en-US')
    grid = '<div id="vehicle-display">'
    grid += '<div id="vehicle-main-pic">'
    grid += '<img class="vehicle-pic" src="' + data.inv_image
    +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
    +' on CSE Motors" />'
    grid += '</div>'
    grid += '<div class="vehicle-details">'
    grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details' + '</h2>'
    grid += '<p><strong>Price: $' 
      + new Intl.NumberFormat('en-US').format(data.inv_price) + '</strong></p>'
    grid += '<p><strong>Description: </strong>' + data.inv_description + '</p>'
    grid += '<p><strong>Color: </strong>' + data.inv_color + '</p>'
    grid += '<p><strong>Mileage: </strong>' + mileageCommas + '</p>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  } 
  return grid
};

/* **************************************
* Build the classification select list HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    `<select class="form-input" name="classification_id" id="classificationList" required value="${classification_id}">`
  classificationList += "<option class='form-input' value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1;
      res.locals.firstName = accountData.account_firstname
      res.locals.accountID = accountData.account_id

      if (accountData.account_type == 'Admin' || accountData.account_type == 'Employee') {
        res.locals.employeeOrAdmin = 1
      } else {
        res.locals.employeeOrAdmin = 0
      } 
      next()
    } 
  )} else {
    next()
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 };

/* ****************************************
* Check JWTToken for account type
**************************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.employeeOrAdmin) {
    next()
  } else {
    req.flash("notice", "Please log in as an employee or manager to access that page.")
    return res.redirect("/account/login")
  }
};

module.exports = Util