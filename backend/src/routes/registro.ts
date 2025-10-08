import { Router } from "express";
import { getdatos, getregistros, saveregistro } from "../controllers/registro";

const router = Router();
router.get("/api/registro/datos/:rfc", getdatos)
router.post("/api/registro/saveregistro/", saveregistro)
router.get("/api/registro/getregistros", getregistros)

export default router