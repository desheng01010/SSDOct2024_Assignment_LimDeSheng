const Contactlist = require("../models/contactlist");

const getAllContactlists = async (req, res) => {
  try {
    const contactlists = await Contactlist.getAllContactlists();
    res.json(contactlists);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving contact lists");
  }
};

const getContactlistByLandlordId = async (req, res) => {
  const landlordid = parseInt(req.params.landlordid);
  try {
    const contactlist = await Contactlist.getContactlistByLandlordId(
      landlordid
    );
    if (!contactlist) {
      return res.status(404).send("Contact List not found");
    }
    res.json(contactlist);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving contact list");
  }
};

const createContactlist = async (req, res) => {
  const newContactlist = req.body;
  try {
    const createdContactlist = await Contactlist.createContactlist(
      newContactlist
    );
    res.status(201).json(createdContactlist);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Contact List");
  }
};

const updateContactlist = async (req, res) => {
  const landlordid = parseInt(req.params.lanlordid);
  const newContactlistData = req.body;

  try {
    const updatedContactlist = await Contactlist.updateContactlist(
      landlordid,
      newContactlistData
    );
    if (!updatedContactlist) {
      return res.status(404).send("Contact list not found");
    }
    res.json(updatedContactlist);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating contact list");
  }
};

const deleteContactlist = async (req, res) => {
  const landlordid = parseInt(req.params.landlordid);

  try {
    const success = await Contactlist.deleteContactlist(landlordid);
    if (!success) {
      return res.status(404).send("Contact list not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting contact list");
  }
};

module.exports = {
  getAllContactlists,
  getContactlistByLandlordId,
  createContactlist,
  updateContactlist,
  deleteContactlist,
};
