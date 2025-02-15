const Invoice = require("../models/invoice");

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving invoices");
  }
};

const getInvoiceByInvoiceNo = async (req, res) => {
  const invoiceno = req.params.invoiceno;
  try {
    const invoice = await Invoice.getInvoiceByInvoiceNo(invoiceno);
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving invoice");
  }
};

const createInvoice = async (req, res) => {
  const newInvoice = req.body;
  try {
    const createdInvoice = await Invoice.createInvoice(newInvoice);
    res.status(201).json(createdInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating invoice");
  }
};

const updateInvoice = async (req, res) => {
  const invoiceno = req.params.invoiceno;
  const newInvoiceData = req.body;

  try {
    const updatedInvoice = await Invoice.updateInvoice(
      invoiceno,
      newInvoiceData
    );
    if (!updatedInvoice) {
      return res.status(404).send("Invoice not found");
    }
    res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating invoice");
  }
};

const deleteInvoice = async (req, res) => {
  const invoiceno = req.params.invoiceno;

  try {
    const success = await Invoice.deleteInvoice(invoiceno);
    if (!success) {
      return res.status(404).send("Invoice not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting invoice");
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceByInvoiceNo,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
