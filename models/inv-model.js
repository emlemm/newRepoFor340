const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
};

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
};


async function getVehicleDataById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory as i
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehicledatabyid error " + error)
  }
};

// Add new classification name
async function addNewClassificationName(classification_name) {
  try {
    const message = "Successfully added new classification into database."
    await pool.query(
      `INSERT INTO  public.classification (classification_name)
      VALUES ($1)`,
      [classification_name]
    )
    return message
  } catch (error) {
    console.error("addNewCLassificationName " + error)
  }
};

// Add new vehicle inventory into database
async function addNewInventory(inv_make, 
      inv_model,
      inv_year, 
      inv_description,
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id) {
  let message = "";
  let status;
  try {
    message = "Successfully added new vehicle into inventory.";
    status = true;
    await pool.query(
      `INSERT INTO public.inventory (
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      )
      VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [inv_make, 
      inv_model,
      inv_year, 
      inv_description,
      "/images/vehicles/no-image.png", 
      "/images/vehicles/no-image-tn.png", 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id]
    )
    return [message, status]
  } catch (error) {
    message = "Failed to update inventory. Please check inputs and try again.";
    status = false;
    console.error("addNewInventory " + error)
    return [message, status]
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleDataById,
  addNewClassificationName,
  addNewInventory
};