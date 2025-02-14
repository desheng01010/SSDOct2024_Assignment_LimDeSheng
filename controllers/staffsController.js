const Staff = require("../models/staff");

const getAllStaffs = async (req, res) => {
  try {
    const staffs = await Staff.getAllStaffs();
    res.json(staffs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving staffs");
  }
};

const getStaffByStaffId = async (req, res) => {
  const staffId = parseInt(req.params.staffid);
  try {
    const staff = await Stuff.getStaffByStaffId(staffId);
    if (!staff) {
      return res.status(404).send("Staff not found");
    }
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving staff");
  }
};

const createStaff = async (req, res) => {
  const newStaff = req.body;
  try {
    const createdStaff = await Staff.createStaff(newStaff);
    res.status(201).json(createdStaff);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Staff");
  }
};

const updateStaff = async (req, res) => {
  const staffId = parseInt(req.params.staffid);
  const newStaffData = req.body;

  try {
    const updatedStaff = await Staff.updateStaff(staffId, newStaffData);
    if (!updatedStaff) {
      return res.status(404).send("Staff not found");
    }
    res.json(updatedStaff);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating staff");
  }
};

const deleteStaff = async (req, res) => {
  const staffId = parseInt(req.params.staffid);

  try {
    const success = await Staff.deleteStaff(staffId);
    if (!success) {
      return res.status(404).send("Staff not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting staff");
  }
};

module.exports = {
  getAllStaffs,
  getStaffByStaffId,
  createStaff,
  updateStaff,
  deleteStaff,
};
