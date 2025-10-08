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
exports.getregistros = exports.saveregistro = exports.getdatos = void 0;
const s_usuario_1 = __importDefault(require("../models/saf/s_usuario"));
const t_dependencia_1 = __importDefault(require("../models/saf/t_dependencia"));
const t_direccion_1 = __importDefault(require("../models/saf/t_direccion"));
const t_departamento_1 = __importDefault(require("../models/saf/t_departamento"));
const registro_1 = __importDefault(require("../models/registro"));
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
const saveregistro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const limite = 3;
        const Existente = yield registro_1.default.findOne({
            where: { rfc_responsable: body.rfc }
        });
        if (Existente) {
            return res.status(400).json({
                status: 400,
                msg: "Ya existe un registro con ese RFC"
            });
        }
        const cita = yield registro_1.default.create({
            nombre_edificio: body.edificio,
            ubicacion: body.direccion,
            rfc_responsable: body.rfc,
            nombre_responsable: body.responsable,
            cargo: body.cargo,
            telefono: body.telefono,
            correo: body.email,
            descripcion_lugar: body.descripcion,
            piso_area: body.piso,
            acepto: 1
        });
        return res.json({
            status: 200,
            msg: "Registro correctamente",
        });
    }
    catch (error) {
        console.error('Error al guardar:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
});
exports.saveregistro = saveregistro;
const getregistros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registros = yield registro_1.default.findAll();
    for (const registro of registros) {
        if (registro.rfc_responsable) {
            const usuario = yield s_usuario_1.default.findOne({
                where: { N_Usuario: registro.rfc_responsable },
                include: [
                    { model: t_dependencia_1.default, as: "dependencia", attributes: ["nombre_completo"] },
                    { model: t_direccion_1.default, as: "direccion", attributes: ["nombre_completo"] },
                    { model: t_departamento_1.default, as: "departamento", attributes: ["nombre_completo"] }
                ]
            });
            if (usuario) {
                registro.setDataValue("datos", usuario);
            }
        }
    }
    return res.json({
        data: registros
    });
});
exports.getregistros = getregistros;
