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

const getAllMyIncidents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const incidentsPerPage = parseInt(req.query.incidentsPerPage) || 5;

    // Count only contacts that belong to the logged-in user
    const totalIncidents = await incidentModel.countDocuments({
      user: req.user,
    });

    if ((page - 1) * incidentsPerPage >= totalIncidents) {
      return res.status(200).json({
        status: false,
        message: "No more records",
      });
    }

    const allIncidents = await incidentModel
      .find({ user: req.user }) // Ensure we're fetching contacts for the logged-in user
      .skip((page - 1) * incidentsPerPage)
      .limit(incidentsPerPage);

    if (allIncidents.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    let data = {
      currentPage: page,
      incidentsPerPage: incidentsPerPage,
      totalIncidents: totalIncidents,
      incidents: allIncidents,
    };

    return res.status(200).json({
      status: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// admin
const getAllIncidentsForAdmin = async (req, res) => {
  try {
    let { category } = req.query;
    let resolved = req.query.resolved === "true";

    console.log("category, resolved : ", category, resolved);

    // const incidents = await incidentModel.find();
    const incidents = await incidentModel.find({ category, resolved });

    const resolvedComplaintCount = await incidentModel
      .find({ category, resolved: true })
      .count();

    console.log("resolvedComplaintCount: ", resolvedComplaintCount);

    // console.log("incidents:  ", incidents);
    if (incidents.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }
    res.status(201).json({
      data: { incidents, resolvedComplaintCount },
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// admin
const incidentDashboard = async (req, res) => {
  try {
    const data = await incidentModel.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          solved: {
            $sum: {
              $cond: ["$resolved", 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
          solved: 1,
          left: { $subtract: ["$total", "$solved"] },
        },
      },
    ]);

    // Check if data is empty
    if (!data.length) {
      return res
        .status(404)
        .json({ status: false, message: "No record found" });
    }

    // Send the data back as a JSON response
    res.status(200).json({
      data: data,
      status: true,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// admin
const deleteIncident = async (req, res) => {
  try {
    let { id } = req.query;

    // const incidents = await incidentModel.find();
    const incidents = await incidentModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Record Deleted Successfully",
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// admin
const resolveCase = async (req, res) => {
  try {
    let { id } = req.query;

    // const incidents = await incidentModel.find();
    const incidents = await incidentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Record Updated Successfully",
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getSingleIncident,
  getAllMyIncidents,
  getAllIncidentsForAdmin,
  incidentDashboard,
  deleteIncident,
  resolveCase,
};
