const Staff = require("../models/staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const e = require("express");

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
  const staffId = req.params.staffid;
  try {
    const staff = await Staff.getStaffByStaffId(staffId);
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
  const staffId = req.params.staffid;
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
  const staffId = req.params.staffid;

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

async function registerStaff(req, res) {
  const { staffid, staffname, email, role, password } = req.body;
  console.log("registerStaff: ", staffname, password, role);

  try {
    const existingStaff = await Staff.getStaffByStaffname(staffname);
    if (existingStaff) {
      return res.status(400).json({ message: "Staffname already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashPassword = await bcrypt.hash(password, salt);

    const newStaff = {
      staffid,
      staffname,
      email,
      role,
      hashedPassword: hashPassword,
    };

    const createdStaff = await Staff.createStaff(newStaff);
    return res.status(201).json(createdStaff);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { staffname, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  console.log("login: ", staffname, password, salt);

  try {
    // Validate staff credentials
    const existingStaff = await Staff.getStaffByStaffname(staffname);
    if (!existingStaff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(
      password,
      existingStaff.hashedPassword
    );
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: existingStaff.id,
      role: existingStaff.role,
    };
    const token = jwt.sign(payload, "your_secret_key", { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllStaffs,
  getStaffByStaffId,
  createStaff,
  updateStaff,
  deleteStaff,
  registerStaff,
  login,
};
