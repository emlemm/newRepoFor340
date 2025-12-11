const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validateInv = {}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validateInv.inventoryRules = () => {
    return [
        // vehicle make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a make for the vehicle."), // on error this message is sent.
        // vehicle model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a model for the vehicle."), // on error this message is sent.
        // vehicle year is required and must be a 4 digit integer
        body("inv_year")
            .trim()
            .escape()
            .isInt()
            .withMessage("Vehicle year must be a number.")
            .isLength({ min: 4 })
            .withMessage("Please provide a 4 digit year for the vehicle."), // on error this message is sent.
        // vehicle description is required and must be string
        body("inv_description")
            .trim()
            .escape()
            .isLength({ min: 5 })
            .withMessage("Please provide a description for the vehicle."), // on error this message is sent.
        // vehicle price is required and must be an integer
        body("inv_price")
            .trim()
            .escape()
            .isInt()
            .withMessage("Price must be an integer.")
            .notEmpty()
            .withMessage("Please provide a price for the vehicle."), // on error this message is sent.
        // vehicle miles is required and must be an integer
        body("inv_miles")
            .trim()
            .escape()
            .isInt()
            .withMessage("Mileage must be an integer")
            .notEmpty()
            .withMessage("Please provide a mileage for the vehicle."), // on error this message is sent.
        // vehicle color is required and must be string
        body("inv_color")
            .trim()
            .escape()
            .isAlphanumeric()
            .withMessage("Color must not contain spaces or special characters.")
            .isLength({ min: 3 })
            .withMessage("Please provide a color for the vehicle."), // on error this message is sent.
        body("classification_id")
            .notEmpty()
            .withMessage("Please choose a classification for the vehicle.")
    ]
}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validateInv.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .isAlphanumeric()
            .withMessage("Please provide a classification name that does not contain spaces or special characters.")
            .isLength({ min: 2 })
            .withMessage("Please provide a classification name for the vehicle.")
    ]
}

/*  **********************************
*  Check classification data and return errors or continue on
* ********************************* */
validateInv.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/* ******************************
* Check data and return errors or continue to adding inventory
* ***************************** */
validateInv.checkInventoryData = async (req, res, next) => {
    const { message, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
    const grid = await utilities.buildClassificationList(classification_id);
    let errors =[]
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        req.flash("notice", message)
        res.render("./inventory/addNewInventory", {
            title: "Add New Inventory",
            nav,
            grid,
            errors,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_price, 
            inv_miles, 
            inv_color
        })
        return
    }
    next()
}

/* ******************************
* Check data and return errors to edit inventory view, or continue to updating inventory
* ***************************** */
validateInv.checkUpdateData = async (req, res, next) => {
    const { message, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    const grid = await utilities.buildClassificationList(classification_id);
    let errors =[]
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        req.flash("notice", message)
        res.render("./inventory/editInventory", {
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            grid,
            errors,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id,
            inv_id
        })
        return
    }
    next()
}

module.exports = validateInv 