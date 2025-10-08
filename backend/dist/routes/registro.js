"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registro_1 = require("../controllers/registro");
const router = (0, express_1.Router)();
router.get("/api/registro/datos/:rfc", registro_1.getdatos);
router.post("/api/registro/saveregistro/", registro_1.saveregistro);
router.get("/api/registro/getregistros", registro_1.getregistros);
exports.default = router;
