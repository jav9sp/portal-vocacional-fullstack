import { Router } from "express";
import { body, param } from "express-validator";
import { CarreraController } from "../controllers/CarreraController";
import { validarCampos } from "../middlewares/validarCampos";

const router = Router();

// Crear carrera
router.post(
  "/",
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("duracion").isInt({ min: 1 }).withMessage("Duración inválida"),
  body("area").notEmpty().withMessage("El área es obligatoria"),
  body("subArea").optional().isString(),
  body("ponderaciones")
    .isObject()
    .withMessage("Ponderaciones debe ser un objeto"),
  body("ponderaciones.nem").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.ranking").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.compLectora").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.mat1").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.mat2").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.historia").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.ciencias").optional().isFloat({ min: 0, max: 100 }),
  validarCampos,
  CarreraController.crearNuevaCarrera
);

// Crear muchas
router.post(
  "/bulk",
  body().isArray().withMessage("El cuerpo debe ser un array de carreras"),
  body("*.nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("*.duracion").isInt({ min: 1 }).withMessage("Duración inválida"),
  body("*.area").notEmpty().withMessage("El área es obligatoria"),
  body("*.subArea").optional().isString(),
  body("*.ponderaciones")
    .isObject()
    .withMessage("Las ponderaciones deben ser un objeto"),
  body("*.ponderaciones.nem").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.ranking").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.compLectora").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.mat1").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.mat2").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.historia").optional().isFloat({ min: 0, max: 100 }),
  body("*.ponderaciones.ciencias").optional().isFloat({ min: 0, max: 100 }),
  validarCampos,
  CarreraController.insertarCarrerasMasivamente
);

// Obtener todas
router.get("/", CarreraController.obtenerCarreras);

// Obtener una
router.get(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  CarreraController.obtenerCarreraPorId
);

// Actualizar
router.put(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  body("nombre").optional().notEmpty(),
  body("duracion").optional().isInt({ min: 1 }),
  body("area").optional().notEmpty(),
  body("subArea").optional().isString(),
  body("ponderaciones").optional().isObject(),
  body("ponderaciones.nem").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.ranking").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.compLectora").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.mat1").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.mat2").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.historia").optional().isFloat({ min: 0, max: 100 }),
  body("ponderaciones.ciencias").optional().isFloat({ min: 0, max: 100 }),
  validarCampos,
  CarreraController.actualizarCarrera
);

// Eliminar
router.delete(
  "/:id",
  param("id").isInt().withMessage("ID debe ser numérico"),
  validarCampos,
  CarreraController.eliminarCarrera
);

export default router;
