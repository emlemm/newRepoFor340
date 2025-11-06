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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util