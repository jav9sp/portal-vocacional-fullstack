import { Request, Response } from "express";
import Carrera from "../models/Carrera.model";

export class CarreraController {
  // Crear una carrera
  static crearNuevaCarrera = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const nuevaCarrera = await Carrera.create(req.body);
      res.status(201).json(nuevaCarrera);
    } catch (error) {
      console.error("Error al crear carrera:", error);
      res.status(500).json({ error: "No se pudo crear la carrera" });
    }
  };

  // Crear muchas carreras
  static insertarCarrerasMasivamente = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const carreras = req.body;

      if (!Array.isArray(carreras)) {
        res
          .status(400)
          .json({ error: "El cuerpo debe ser un array de carreras" });
        return;
      }

      const nuevasCarreras = await Carrera.bulkCreate(carreras, {
        validate: true,
      });

      res.status(201).json({
        mensaje: `${nuevasCarreras.length} carreras insertadas correctamente`,
        carreras: nuevasCarreras,
      });
    } catch (error) {
      console.error("Error en inserción masiva:", error);
      res.status(500).json({ error: "No se pudieron insertar las carreras" });
    }
  };

  // Obtener todas las carreras
  static obtenerCarreras = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const carreras = await Carrera.findAll();
      res.status(200).json(carreras);
    } catch (error) {
      console.error("Error al obtener carreras:", error);
      res.status(500).json({ error: "No se pudieron obtener las carreras" });
    }
  };

  // Obtener carrera por Id
  static obtenerCarreraPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const carrera = await Carrera.findByPk(req.params.id);
      if (!carrera) {
        res.status(404).json({ error: "Carrera no encontrada" });
      }
      res.status(200).json(carrera);
    } catch (error) {
      console.error("Error al buscar carrera:", error);
      res.status(500).json({ error: "No se pudo obtener la carrera" });
    }
  };

  // Actualizar carrera por id
  static actualizarCarrera = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const carrera = await Carrera.findByPk(req.params.id);
      if (!carrera) {
        res.status(404).json({ error: "Carrera no encontrada" });
      }
      await carrera.update(req.body);
      res.status(200).json(carrera);
    } catch (error) {
      console.error("Error al actualizar carrera:", error);
      res.status(500).json({ error: "No se pudo actualizar la carrera" });
    }
  };

  // Eliminar carrera por id
  static eliminarCarrera = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const carrera = await Carrera.findByPk(req.params.id);
      if (!carrera) {
        res.status(404).json({ error: "Carrera no encontrada" });
      }
      await carrera.destroy();
      res.status(200).json({ mensaje: "Carrera eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar carrera:", error);
      res.status(500).json({ error: "No se pudo eliminar la carrera" });
    }
  };
}
