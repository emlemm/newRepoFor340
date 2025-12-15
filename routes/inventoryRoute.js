// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const util = require('../utilities')
const validateInv = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:id", util.handleErrors(invController.buildByInventoryId));

// Built-in 500 error 
router.get("/error", util.handleErrors(invController.builtInError));

// Route to inventory management views
router.get("/management", 
    util.checkLogin,
    util.checkAccountType,
    util.handleErrors(invController.buildInvManagement));
router.get("/addClassification", 
    util.checkAccountType,
    util.handleErrors(invController.buildAddClassification));
router.get("/addNewInventory",
    util.checkAccountType,
    util.handleErrors(invController.buildAddNewInventory));
router.get("/getInventory/:classification_id", 
    util.checkAccountType,
    util.handleErrors(invController.getInventoryJSON));

//process add new classification
router.post("/addClassification", 
    validateInv.classificationRules(),
    validateInv.checkClassificationData,
    util.checkAccountType,
    util.handleErrors(invController.processAddClassification));

//process add new inventory
router.post("/addNewInventory", 
    validateInv.inventoryRules(),
    validateInv.checkInventoryData,
    util.checkAccountType,
    util.handleErrors(invController.processAddNewInventory));

//process edit inventory views
router.get("/edit/:inventoryId", 
    util.checkAccountType,
    util.handleErrors(invController.buildEditInventory));
router.post("/update", 
    validateInv.inventoryRules(),
    validateInv.checkUpdateData,
    util.handleErrors(invController.updateInventory));

//process delete inventory request
router.get("/delete/:inventoryId", 
    util.checkAccountType,
    util.handleErrors(invController.buildDeleteView));
router.post("/delete", 
    util.checkAccountType,
    util.handleErrors(invController.processDeleteRequest));


module.exports = router;