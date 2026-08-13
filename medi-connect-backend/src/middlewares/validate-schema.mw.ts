import type { NextFunction, Request, Response } from "express";
import type { ZodObject, ZodRawShape } from "zod";

export const validateSchema =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedBody.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    req.body = parsedBody.data;
    next();
  };
