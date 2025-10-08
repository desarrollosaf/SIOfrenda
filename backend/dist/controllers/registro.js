"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getdatos = void 0;
const s_usuario_1 = __importDefault(require("../models/saf/s_usuario"));
const t_dependencia_1 = __importDefault(require("../models/saf/t_dependencia"));
const t_direccion_1 = __importDefault(require("../models/saf/t_direccion"));
const t_departamento_1 = __importDefault(require("../models/saf/t_departamento"));
const getdatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { rfc } = req.params;
    const usuario = yield s_usuario_1.default.findOne({
        where: { N_Usuario: rfc },
        attributes: ['Nombre', 'N_Usuario', 'Puesto'],
        include: [
            {
                model: t_dependencia_1.default,
                as: 'dependencia',
                attributes: ['nombre_completo'],
            },
            {
                model: t_direccion_1.default,
                as: 'direccion',
                attributes: ['nombre_completo'],
            },
            {
                model: t_departamento_1.default,
                as: 'departamento',
                attributes: ['nombre_completo'],
            },
        ],
    });
    if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    const dep = ((_a = usuario.dependencia) === null || _a === void 0 ? void 0 : _a.nombre_completo) || '';
    const dir = ((_b = usuario.direccion) === null || _b === void 0 ? void 0 : _b.nombre_completo) || '';
    const depto = ((_c = usuario.departamento) === null || _c === void 0 ? void 0 : _c.nombre_completo) || '';
    const ubicacion_completa = `${dep}/${dir}/${depto}`;
    return res.json(Object.assign(Object.assign({}, usuario.toJSON()), { ubicacion_completa }));
});
exports.getdatos = getdatos;
