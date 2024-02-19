const express = require("express");
const {
  createIncident,
  getAllIncidents,
  getSingleIncident,
  getAllMyIncidents,
} = require("../controller/incidentController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const incidentRouter = express.Router();

incidentRouter.post("/createIncident", isAuthenticatedUser, createIncident);
incidentRouter.get("/allIncidents", isAuthenticatedUser, getAllIncidents);
incidentRouter.get("/singleIncident", isAuthenticatedUser, getSingleIncident);
incidentRouter.get(
  "/getAllMyIncidents",
  isAuthenticatedUser,
  getAllMyIncidents
);

module.exports = incidentRouter;
