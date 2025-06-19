import { Router } from "express";
import { body, param } from "express-validator";
import { InstitucionController } from "../controllers/InstitucionController";
import { validarCampos } from "../middlewares/validarCampos";

const router = Router();

// Crear
router.post(
  "/",
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("pace").isBoolean().withMessage("PACE debe ser booleano"),
  body("tipo").isIn(["Universidad", "IP", "CFT"]).withMessage("Tipo inválido"),
  body("gratuidad").isBoolean().withMessage("Gratuidad debe ser booleano"),
  validarCampos,
  InstitucionController.crearNuevaInstitucion
);

// Obtener todas
router.get("/", InstitucionController.obtenerInstituciones);

// Obtener una
router.get(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  InstitucionController.obtenerInstitucionPorId
);

// Obtener las sedes
router.get(
  "/instituciones/:id/sedes",
  param("id").isInt().withMessage("ID de institución inválido"),
  validarCampos,
  InstitucionController.obtenerSedesPorInstitucion
);

// Actualizar
router.put(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("pace").optional().isBoolean().withMessage("PACE debe ser booleano"),
  body("tipo")
    .optional()
    .isIn(["Universidad", "IP", "CFT"])
    .withMessage("Tipo inválido"),
  body("gratuidad")
    .optional()
    .isBoolean()
    .withMessage("Gratuidad debe ser booleano"),
  validarCampos,
  InstitucionController.actualizarInstitucion
);

// Eliminar
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  InstitucionController.eliminarInstitucion
);

export default router;
