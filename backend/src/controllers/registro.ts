import { Request, Response } from "express"
import SUsuario from "../models/saf/s_usuario";
import Dependencia from "../models/saf/t_dependencia";
import Direccion from "../models/saf/t_direccion";
import Departamento from "../models/saf/t_departamento";
import Registro from "../models/registro";

export const getdatos = async (req: Request, res: Response): Promise<any> => {
     const { rfc } = req.params;
     const usuario = await SUsuario.findOne({
        where: { N_Usuario: rfc },
        attributes: ['Nombre', 'N_Usuario', 'Puesto'],
        include: [
            {
            model: Dependencia,
            as: 'dependencia',
            attributes: ['nombre_completo'],
            },
            {
            model: Direccion,
            as: 'direccion',
            attributes: ['nombre_completo'],
            },
            {
            model: Departamento,
            as: 'departamento',
            attributes: ['nombre_completo'],
            },
        ],
        });

        if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

    
        const dep = usuario.dependencia?.nombre_completo || '';
        const dir = usuario.direccion?.nombre_completo || '';
        const depto = usuario.departamento?.nombre_completo || '';

       
        const ubicacion_completa = `${dep}/${dir}/${depto}`;

       
        return res.json({
        ...usuario.toJSON(),  
        ubicacion_completa,   
        });

}

export const saveregistro = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const limite = 3;

    
    const Existente = await Registro.findOne({
      where: { rfc_responsable: body.rfc }
    });

    if (Existente) {
      return res.status(400).json({
        status: 400,
        msg: "Ya existe un registro con ese RFC"
      });
    }
     const cita = await Registro.create({
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

    } catch (error) {
      console.error('Error al guardar:', error);
      return res.status(500).json({ msg: 'Error interno del servidor' });
    }
   
  }

  export const getregistros = async (req: Request, res: Response): Promise<any> => {
    const registros = await Registro.findAll();

    for (const registro of registros) {
      if (registro.rfc_responsable) {
        const usuario = await SUsuario.findOne({
          where: { N_Usuario: registro.rfc_responsable },
          include: [
            { model: Dependencia, as: "dependencia", attributes: ["nombre_completo"] },
            { model: Direccion, as: "direccion", attributes: ["nombre_completo"] },
            { model: Departamento, as: "departamento", attributes: ["nombre_completo"] }
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
  }