// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const util = require('../utilities')

// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", util.handleErrors(invController.buildByInventoryId));

// Built-in 500 error 
router.get("/error", util.handleErrors(invController.builtInError));

// Route to inventory management views
router.get("/management", util.handleErrors(invController.buildInvManagement));
router.get("/addClassification", util.handleErrors(invController.buildAddClassification));
router.get("/addNewInventory", util.handleErrors(invController.buildAddNewInventory));

//process add new classification
router.post("/addClassification", util.handleErrors(invController.processAddClassification));

//process add new inventory
router.post("/addNewInventory", util.handleErrors(invController.processAddNewInventory));

module.exports = router;