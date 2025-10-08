"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const cuestionariosConnection_1 = __importDefault(require("../database/cuestionariosConnection"));
class Registro extends sequelize_1.Model {
}
Registro.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_edificio: {
        type: sequelize_1.DataTypes.STRING,
    },
    ubicacion: {
        type: sequelize_1.DataTypes.STRING,
    },
    rfc_responsable: {
        type: sequelize_1.DataTypes.STRING,
    },
    nombre_responsable: {
        type: sequelize_1.DataTypes.STRING,
    },
    cargo: {
        type: sequelize_1.DataTypes.STRING,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
    },
    descripcion_lugar: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
    piso_area: {
        type: sequelize_1.DataTypes.TEXT('long'),
    },
    acepto: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: cuestionariosConnection_1.default,
    tableName: 'registros',
    timestamps: true,
});
exports.default = Registro;
