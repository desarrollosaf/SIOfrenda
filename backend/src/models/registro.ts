import { Model, DataTypes, CreationOptional } from 'sequelize';
import sequelize from '../database/cuestionariosConnection';

class Registro extends Model {
  declare id: CreationOptional<number>;
  declare nombre_edificio: string;
  declare ubicacion: string;
  declare rfc_responsable: string;
  declare nombre_responsable: string;
  declare cargo: string;
  declare telefono: string;
  declare correo: string;
  declare descripcion_lugar: string;
  declare piso_area: string;
  declare acepto: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Registro.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_edificio: {
      type: DataTypes.STRING,
    },
    ubicacion: {
      type: DataTypes.STRING,
    },
    rfc_responsable: {
      type: DataTypes.STRING,
    },
    nombre_responsable: {
      type: DataTypes.STRING,
    },
    cargo: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    correo: {
      type: DataTypes.STRING,
    },
    descripcion_lugar: {
      type: DataTypes.TEXT('long'),
    },
    piso_area: {
      type: DataTypes.TEXT('long'),
    },
    acepto: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'registros',
    timestamps: true, 
  }
);

export default Registro;
