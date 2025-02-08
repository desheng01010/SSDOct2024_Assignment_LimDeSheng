const Legend = require("../models/legend");

const getAllLegends = async (req, res) => {
  try {
    const legends = await Legend.getAllLegends();
    res.json(legends);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving legends");
  }
};

const getLegendByLegendCode = async (req, res) => {
  const legendCode = parseInt(req.params.legendcode);
  try {
    const legend = await Legend.getLegendByLegendCode(legendCode);
    if (!legend) {
      return res.status(404).send("Legend not found");
    }
    res.json(legend);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving legend");
  }
};

const createLegend = async (req, res) => {
  const newLegend = req.body;
  try {
    const createdLegend = await Legend.createLegend(newLegend);
    res.status(201).json(createdLegend);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating Legend");
  }
};

const updateLegend = async (req, res) => {
  const legendCode = parseInt(req.params.legendcode);
  const newLegendData = req.body;

  try {
    const updatedLegend = await Legend.updateLegend(legendCode, newLegendData);
    if (!updatedLegend) {
      return res.status(404).send("Legend not found");
    }
    res.json(updatedLegend);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating legend");
  }
};

const deleteLegend = async (req, res) => {
  const legendCode = parseInt(req.params.legendcode);

  try {
    const success = await Legend.deleteLegend(legendCode);
    if (!success) {
      return res.status(404).send("Legend not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting legend");
  }
};

module.exports = {
  getAllLegends,
  getLegendByLegendCode,
  createLegend,
  updateLegend,
  deleteLegend,
};
