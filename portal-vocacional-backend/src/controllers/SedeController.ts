import { Request, Response } from "express";
import Sede from "../models/Sede.model";
import Institucion from "../models/Institucion.model";

export class SedeController {
  // Crear nueva sede
  static crearSede = async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaSede = await Sede.create(req.body);
      res.status(201).json(nuevaSede);
    } catch (error) {
      console.error("Error al crear sede:", error);
      res.status(500).json({ error: "No se pudo crear la sede" });
    }
  };

  // Obtener todas las sedes
  static obtenerSedes = async (req: Request, res: Response): Promise<void> => {
    try {
      const sedes = await Sede.findAll({ include: [Institucion] });
      res.status(200).json(sedes);
    } catch (error) {
      console.error("Error al obtener sedes:", error);
      res.status(500).json({ error: "No se pudieron obtener las sedes" });
    }
  };

  // Obtener una sede por ID
  static obtenerSedePorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const sede = await Sede.findByPk(req.params.id, {
        include: [Institucion],
      });
      if (!sede) {
        res.status(404).json({ error: "Sede no encontrada" });
        return;
      }
      res.status(200).json(sede);
    } catch (error) {
      console.error("Error al buscar sede:", error);
      res.status(500).json({ error: "No se pudo obtener la sede" });
    }
  };

  // Actualizar sede
  static actualizarSede = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const sede = await Sede.findByPk(req.params.id);
      if (!sede) {
        res.status(404).json({ error: "Sede no encontrada" });
        return;
      }
      await sede.update(req.body);
      res.status(200).json(sede);
    } catch (error) {
      console.error("Error al actualizar sede:", error);
      res.status(500).json({ error: "No se pudo actualizar la sede" });
    }
  };

  // Eliminar sede
  static eliminarSede = async (req: Request, res: Response): Promise<void> => {
    try {
      const sede = await Sede.findByPk(req.params.id);
      if (!sede) {
        res.status(404).json({ error: "Sede no encontrada" });
        return;
      }
      await sede.destroy();
      res.status(200).json({ mensaje: "Sede eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar sede:", error);
      res.status(500).json({ error: "No se pudo eliminar la sede" });
    }
  };
}
