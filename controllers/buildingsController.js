const Building = require("../models/building");

const getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.getAllBuildings();
    res.json(buildings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving buildings");
  }
};

const getBuildingByBuildingCode = async (req, res) => {
  const buildingCode = req.params.buildingcode;
  try {
    const building = await Building.getBuildingByBuildingCode(buildingCode);
    if (!building) {
      return res.status(404).send("Building not found");
    }
    res.json(building);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving building");
  }
};

const createBuilding = async (req, res) => {
  const newBuilding = req.body;
  try {
    const createdBuilding = await Building.createBuilding(newBuilding);
    res.status(201).json(createdBuilding);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Building");
  }
};

const updateBuilding = async (req, res) => {
  const buildingCode = req.params.buildingcode;
  const newBuildingData = req.body;

  try {
    const updatedBuilding = await Building.updateBuilding(
      buildingCode,
      newBuildingData
    );
    if (!updatedBuilding) {
      return res.status(404).send("Building not found");
    }
    res.json(updatedBuilding);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating building");
  }
};

const deleteBuilding = async (req, res) => {
  const buildingCode = req.params.buildingcode;

  try {
    const success = await Building.deleteBuilding(buildingCode);
    if (!success) {
      return res.status(404).send("Building not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting building");
  }
};

module.exports = {
  getAllBuildings,
  getBuildingByBuildingCode,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
