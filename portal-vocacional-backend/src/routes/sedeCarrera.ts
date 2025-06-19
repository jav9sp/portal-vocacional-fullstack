import { Router } from "express";
import { body } from "express-validator";
import { SedeCarreraController } from "../controllers/SedeCarreraController";
import { validarCampos } from "../middlewares/validarCampos";

const router = Router();

router.post(
  "/",
  body("idSede").isInt().withMessage("idSede debe ser numérico"),
  body("idCarrera").isInt().withMessage("idCarrera debe ser numérico"),
  body("jornada").notEmpty().withMessage("La jornada es obligatoria"),
  body("arancel").optional().isInt({ min: 0 }),
  body("cuposPace").optional().isInt({ min: 0 }),
  body("puntajeCorte").optional().isInt({ min: 0 }),
  body("enlace").optional().isURL().withMessage("El enlace debe ser válido"),
  validarCampos,
  SedeCarreraController.crearRelacion
);

export default router;
