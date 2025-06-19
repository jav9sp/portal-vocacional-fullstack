import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validarCampos = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    return;
  }
  next();
};
