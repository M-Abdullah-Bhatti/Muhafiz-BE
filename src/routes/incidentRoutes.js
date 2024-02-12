const express = require("express");
const {
  createIncident,
  getAllIncidents,
} = require("../controller/incidentController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const incidentRouter = express.Router();

incidentRouter.post("/createIncident", isAuthenticatedUser, createIncident);
incidentRouter.get("/allIncidents", isAuthenticatedUser, getAllIncidents);

module.exports = incidentRouter;
