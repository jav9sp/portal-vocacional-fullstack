import { Request, Response } from "express";
import Institucion from "../models/Institucion.model";
import Sede from "../models/Sede.model";

export class InstitucionController {
  // Crear nueva institución
  static crearNuevaInstitucion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const institucion = new Institucion(req.body);

      const nuevaInstitucion = await institucion.save();

      res.status(201).json(nuevaInstitucion);
    } catch (error) {
      console.error("ERROR en crearNuevaInstitucion:", error);
      res.status(500).json({ error: "Hubo un error al crear la institución" });
    }
  };

  // Obtener todas las instituciones
  static obtenerInstituciones = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const instituciones = await Institucion.findAll();
      res.status(200).json(instituciones);
    } catch (error) {
      console.error("ERROR en obtenerInstituciones:", error);
      res
        .status(500)
        .json({ error: "Hubo un error al obtener las instituciones" });
    }
  };

  // Obtener institución por id
  static obtenerInstitucionPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const institucion = await Institucion.findByPk(id);

      if (!institucion) {
        res.status(404).json({ error: "Institución no encontrada" });
        return;
      }

      res.status(200).json(institucion);
    } catch (error) {
      console.error("ERROR en obtenerInstitucionPorId:", error);
      res.status(500).json({ error: "Hubo un error al buscar la institución" });
    }
  };

  // Obtener las sedes de la institución
  static obtenerSedesPorInstitucion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    try {
      const sedes = await Sede.findAll({
        where: { idInstitucion: id },
      });

      if (sedes.length === 0) {
        res
          .status(404)
          .json({ mensaje: "No se encontraron sedes para esta institución" });
        return;
      }

      res.status(200).json(sedes);
    } catch (error) {
      console.error("Error al obtener sedes por institución:", error);
      res.status(500).json({ error: "No se pudieron obtener las sedes" });
    }
  };

  // Actualizar una institución
  static actualizarInstitucion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const institucion = await Institucion.findByPk(id);

      if (!institucion) {
        res.status(404).json({ error: "Institución no encontrada" });
        return;
      }

      await institucion.update(req.body);
      res.status(200).json(institucion);
    } catch (error) {
      console.error("ERROR en actualizarInstitucion:", error);
      res.status(500).json({ error: "Error al actualizar la institución" });
    }
  };

  // Eliminar una institución
  static eliminarInstitucion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const institucion = await Institucion.findByPk(id);

      if (!institucion) {
        res.status(404).json({ error: "Institución no encontrada" });
        return;
      }

      await institucion.destroy();
      res.status(200).json({ mensaje: "Institución eliminada correctamente" });
    } catch (error) {
      console.error("ERROR en eliminarInstitucion:", error);
      res.status(500).json({ error: "Error al eliminar la institución" });
    }
  };
}
