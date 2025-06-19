import { Router } from "express";
import { body, param } from "express-validator";
import { SedeController } from "../controllers/SedeController";
import { validarCampos } from "../middlewares/validarCampos";

const router = Router();

// Crear sede
router.post(
  "/",
  body("idInstitucion").isInt().withMessage("idInstitucion debe ser numérico"),
  body("region").notEmpty().withMessage("La región es obligatoria"),
  body("comuna").notEmpty().withMessage("La comuna es obligatoria"),
  body("direccion").notEmpty().withMessage("La dirección es obligatoria"),
  validarCampos,
  SedeController.crearSede
);

// Obtener todas las sedes
router.get("/", SedeController.obtenerSedes);

// Obtener sede por ID
router.get(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  SedeController.obtenerSedePorId
);

// Actualizar sede
router.put(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  body("region").optional().notEmpty(),
  body("comuna").optional().notEmpty(),
  body("direccion").optional().notEmpty(),
  body("idInstitucion").optional().isInt(),
  validarCampos,
  SedeController.actualizarSede
);

// Eliminar sede
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  SedeController.eliminarSede
);

export default router;
