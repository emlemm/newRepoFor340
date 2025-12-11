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
  const classificationSelect = await utilities.buildClassificationList()
  res.render ("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect
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
  const classificationSelect = await utilities.buildClassificationList()
  let nav = await utilities.getNav();
  req.flash("notice", data)
  res.render ("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect
  })
}

/* ***************************
 *  Build management view after successfully adding inventory 
 * ************************** */
invCont.processAddNewInventory = async function (req, res, next) {
  const inv_make = req.body.inv_make;
  const inv_model = req.body.inv_model;
  const inv_year = req.body.inv_year;
  const inv_description = req.body.inv_description;
  const inv_price = req.body.inv_price;
  const inv_miles = req.body.inv_miles;
  const inv_color = req.body.inv_color;
  const classification_id = req.body.classification_id;
  const message = await invModel.addNewInventory(inv_make, 
      inv_model,
      inv_year, 
      inv_description,
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id);
  const classificationSelect = await utilities.buildClassificationList() 
  let nav = await utilities.getNav();
  req.flash("notice", message)
  res.render ("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect
  });
}

/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildAddNewInventory = async function (req, res, next) {
  const grid = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  res.render ("./inventory/addNewInventory", {
    title: "Add New Inventory",
    nav,
    grid,
    errors: null
  });
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Built-in 500 error for footer
 * ************************** */
invCont.builtInError = async function (req, res, next) {
  throw new Error ("Intentional error")
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDataById(inv_id)
  console.log(itemData[0])
  const classificationInputValue = itemData[0].classification_id
  const grid = await utilities.buildClassificationList(classificationInputValue)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render ("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
    grid
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory( 
    inv_id, 
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    const classificationSelect = await utilities.buildClassificationList() 
    res.render ("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    const grid = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `Sorry, the update of ${itemName} failed.`)
    res.status(501).render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    grid,
    errors: null,
    inv_id: inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Delete vehicle view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDataById(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render ("./inventory/deleteConfirm", {
    title: "Delete " + itemName + "?",
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Delete vehicle and deliver inventory managament view
 * ************************** */
invCont.processDeleteRequest = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const itemName = `${inv_make} ${inv_model}`
  console.log(inv_id)
  const deleteVehicle = await invModel.deleteInventoryItem(inv_id)
  console.log(deleteVehicle)
  console.log(deleteVehicle.typeof)
  if (deleteVehicle) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    const classificationSelect = await utilities.buildClassificationList() 
    res.render ("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", `Sorry, the deletion of ${itemName} failed.`)
    res.render ("./inventory/deleteConfirm", {
    title: "Delete " + itemName + "?",
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  })
  }
}

module.exports = invCont