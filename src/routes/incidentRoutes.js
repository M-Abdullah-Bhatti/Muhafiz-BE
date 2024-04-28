const express = require("express");
const {
  createIncident,
  getAllIncidents,
  getSingleIncident,
  getAllMyIncidents,
  getAllIncidentsForAdmin,
  incidentDashboard,
  deleteIncident,
  resolveCase,
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
incidentRouter.get(
  "/getAllIncidents",
  isAuthenticatedUser,
  getAllIncidentsForAdmin
);
incidentRouter.get(
  "/incidentDashboard",
  isAuthenticatedUser,
  incidentDashboard
);
incidentRouter.delete("/deleteIncident", isAuthenticatedUser, deleteIncident);

incidentRouter.put("/resolveIncident", isAuthenticatedUser, resolveCase);

module.exports = incidentRouter;
