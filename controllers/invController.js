const invModel = require("../models/inv-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
};

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.id
  const data = await invModel.getVehicleDataById(inventory_id)
  const grid = await utilities.buildVehicleDataGrid(data)
  let nav = await utilities.getNav()
  const vehicleYear = data[0].inv_year
  const vehicleMake = data[0].inv_make
  const vehicleModel = data[0].inv_model
  res.render ("./inventory/vehicleDetail", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav, 
    grid
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
  //const grid = await
  let nav = await utilities.getNav()
  res.render ("./inventory/management", {
    title: "Inventory Management",
    nav
  })
}

/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render ("./inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build management view after successfully adding classification name
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  const classification_name = req.body.classification_name;
  const data = await invModel.addNewClassificationName(classification_name);
  let nav = await utilities.getNav();
  req.flash("notice", data)
  res.render ("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build management view after successfully adding inventory 
 *  OR Build addNewInventory view after unseccessfully trying to add new inventory
 * ************************** */
invCont.processAddNewInventory = async function (req, res, next) {
  const inv_make = req.body.inv_make;
  const inv_model = req.body.inv_model;
  const inv_year = req.body.inv_year;
  const inv_description = req.body.inv_description;
  const inv_image = req.body.inv_image;
  const inv_thumbnail = req.body.inv_thumbnail;
  const inv_price = req.body.inv_price;
  const inv_miles = req.body.inv_miles;
  const inv_color = req.body.inv_color;
  const classification_id = req.body.classification_id;
  const [message, status] = await invModel.addNewInventory(inv_make, 
      inv_model,
      inv_year, 
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id);
  let nav = await utilities.getNav();
  if (status) {
    req.flash("notice", message)
    res.render ("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
  }
  else {
    req.flash("notice", message)
    res.render("./inventory/addNewInventory", {
      title: "Add New Inventory",
      nav,
      grid,
      errors: null
    })
  }
}

/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildAddNewInventory = async function (req, res, next) {
  const grid = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render ("./inventory/addNewInventory", {
    title: "Add New Inventory",
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Built-in 500 error for footer
 * ************************** */
invCont.builtInError = async function (req, res, next) {
  throw new Error ("Intentional error")
}

module.exports = invCont