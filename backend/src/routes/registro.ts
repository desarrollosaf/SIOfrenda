import { Router } from "express";
import { getdatos } from "../controllers/registro";

const router = Router();
router.get("/api/registro/datos/:rfc", getdatos)

export default router