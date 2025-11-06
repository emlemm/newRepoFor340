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
 *  Built-in 500 error for footer
 * ************************** */
invCont.builtInError = async function (req, res, next) {
  throw new Error ("Intentional error")
}

module.exports = invCont