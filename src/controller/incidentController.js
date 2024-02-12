const incidentModel = require("../models/incidentModel");

// Create a new post
const createIncident = async (req, res) => {
  try {
    const newIncident = incidentModel.create(req.body);
    res.status(201).json({
      data: newIncident,
      status: true,
      message: "Incident created successfully!",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all posts
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await incidentModel.find();
    if (incidents.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }
    res.status(201).json({
      data: incidents,
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
};
