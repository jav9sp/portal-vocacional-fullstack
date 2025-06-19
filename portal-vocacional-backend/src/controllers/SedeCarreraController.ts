import { Request, Response } from "express";
import SedeCarrera from "../models/SedeCarrera.model";
import Carrera from "../models/Carrera.model";
import Sede from "../models/Sede.model";

export class SedeCarreraController {
  static crearRelacion = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        idSede,
        idCarrera,
        jornada,
        arancel,
        cuposPace,
        puntajeCorte,
        enlace,
      } = req.body;

      // Validaciones básicas opcionales (también pueden hacerse con express-validator)
      const sede = await Sede.findByPk(idSede);
      const carrera = await Carrera.findByPk(idCarrera);
      if (!sede || !carrera) {
        res.status(404).json({ error: "Sede o carrera no encontrada" });
        return;
      }

      const nuevaRelacion = await SedeCarrera.create({
        idSede,
        idCarrera,
        jornada,
        arancel,
        cuposPace,
        puntajeCorte,
        enlace,
      });

      res.status(201).json(nuevaRelacion);
    } catch (error) {
      console.error("❌ Error al crear relación sede-carrera:", error);
      res.status(500).json({ error: "No se pudo registrar la relación" });
    }
  };
}
