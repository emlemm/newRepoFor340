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

module.exports = router;