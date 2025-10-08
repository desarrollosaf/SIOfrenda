import { Request, Response } from "express"
import SUsuario from "../models/saf/s_usuario";
import Dependencia from "../models/saf/t_dependencia";
import Direccion from "../models/saf/t_direccion";
import Departamento from "../models/saf/t_departamento";

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