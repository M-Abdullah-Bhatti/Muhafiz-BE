const { default: mongoose } = require("mongoose");
const incidentModel = require("../models/incidentModel");

// Create a new post
const createIncident = async (req, res) => {
  try {
    console.log("req: ", req.body);
    const newIncident = await incidentModel.create(req.body);
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
    const incidents = await incidentModel.find({ user: req.user });
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

const getSingleIncident = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ID",
      });
    }

    const foundIncident = await incidentModel.findById(id);

    if (!foundIncident) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: foundIncident,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getSingleIncident,
};
