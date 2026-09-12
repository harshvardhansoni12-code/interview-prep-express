import { Router } from "express";
const ItemRouter = Router();
import * as ItemController from "../../controller/item.controller.js";
ItemRouter.get("/create-item", ItemController.ItemCreate);

export default ItemRouter;
