import areaController from "./areaController";
import area_controllers  from "./areaController";
import express, { Request, Response } from "express";
const bodyParser = require("body-parser");

const area_router = express.Router();

area_router.use(bodyParser.json());

area_router.get("/", area_controllers.get_areas);
area_router.get("/services", area_controllers.get_services);
area_router.get("/service/:name/actions", area_controllers.get_actions);
area_router.get("/service/:name/reactions", area_controllers.get_reactions);
area_router.get("/service/:service_name/:method_name", area_controllers.get_params);
area_router.get("/:id", area_controllers.get_area);

area_router.post("/add", area_controllers.add_area);
area_router.post("/:id/modify", area_controllers.modify_area);

area_router.delete("/:id/delete", area_controllers.delete_area);

export default area_router;
