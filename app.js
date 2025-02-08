/*Import Express and body-parser*/
const express = require("express");
const sql = require("mssql");
const legendsController = require("./controllers/legendsController");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const validateLegend = require("./middlewares/validateLegend");
const buildingsController = require("./controllers/buildingsController");
const validateBuilding = require("./middlewares/validateBuilding");
const contactlistsController = require("./controllers/contactlistsController");
const validateContactlist = require("./middlewares/validateContactlist");
const quotationsController = require("./controllers/quotationsController");
const validateQuotation = require("./middlewares/validateQuotation");
const invoicesController = require("./controllers/invoicesController");
const validateInvoice = require("./middlewares/validateInvoice");

/*Instantiate the Express app*/
const app = express();
const port = 3000; // Use environment variable

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.get("/legends", legendsController.getAllLegends); // Routes for GET requests
app.get("/legends/:legendcode", legendsController.getLegendByLegendCode);
app.post("/legends", validateLegend, legendsController.createLegend); // POST for creating legends (can handle JSON data)
app.put("/legends/:legendcode", validateLegend, legendsController.updateLegend); // PUT for updating legends
app.delete("/legends/:legendcode", legendsController.deleteLegend); // DELETE for deleting legends

app.get("/buildings", buildingsController.getAllBuildings); // Routes for GET requests
app.get(
  "/buildings/:buildingcode",
  buildingsController.getBuildingByBuildingCode
);
app.post("/buildings", validateBuilding, buildingsController.createBuilding); // POST for creating buildings (can handle JSON data)
app.put(
  "/buildings/:buildingcode",
  validateBuilding,
  buildingsController.updateBuilding
); // PUT for updating buildings
app.delete("/buildings/:buildingcode", buildingsController.deleteBuilding); // DELETE for deleting buildings

app.get("/contactlists", contactlistsController.getAllContactlists); // Routes for GET requests
app.get(
  "/contactlists/:landlordid",
  contactlistsController.getContactlistByLandlordId
);
app.post(
  "/contactlists",
  validateContactlist,
  contactlistsController.createContactlist
); // POST for creating contact lists (can handle JSON data)
app.put(
  "/contactlists/:landlordid",
  validateContactlist,
  contactlistsController.updateContactlist
); // PUT for updating contact lists
app.delete(
  "/contactlists/:landlordid",
  contactlistsController.deleteContactlist
); // DELETE for deleting contact lists

app.get("/quotations", quotationsController.getAllQuotations); // Routes for GET requests
app.get(
  "/quotations/:quotationno",
  quotationsController.getQuotationByQuotationNo
);
app.post(
  "/quotations",
  validateQuotation,
  quotationsController.createQuotation
); // POST for creating quotations (can handle JSON data)
app.put(
  "/quotations/:quotationno",
  validateQuotation,
  quotationsController.updateQuotation
); // PUT for updating quotations
app.delete("/quotations/:quotationno", quotationsController.deleteQuotation); // DELETE for deleting Quotations

app.get("/invoices", invoicesController.getAllInvoices); // Routes for GET requests
app.get("/invoices/:invoiceno", invoicesController.getInvoiceByInvoiceNo);
app.post("/invoices", validateInvoice, invoicesController.createInvoice); // POST for creating Invoices (can handle JSON data)
app.put(
  "/invoices/:invoiceno",
  validateInvoice,
  invoicesController.updateInvoice
); // PUT for updating Invoices
app.delete("/invoices/:invoiceno", invoicesController.deleteInvoice); // DELETE for deleting Invoices

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
