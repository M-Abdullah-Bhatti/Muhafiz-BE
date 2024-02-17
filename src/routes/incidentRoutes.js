const express = require("express");
const {
  createIncident,
  getAllIncidents,
  getSingleIncident,
} = require("../controller/incidentController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const incidentRouter = express.Router();

incidentRouter.post("/createIncident", isAuthenticatedUser, createIncident);
incidentRouter.get("/allIncidents", isAuthenticatedUser, getAllIncidents);
incidentRouter.get("/singleIncident", isAuthenticatedUser, getSingleIncident);

module.exports = incidentRouter;
