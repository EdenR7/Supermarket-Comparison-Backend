import { NextFunction, Request, Response } from "express";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { errorName, errorMessage, statusCode } = getErrorData(err);
  console.log("errorHandler :");
  console.log(
    "errorName:",
    errorName,
    "errorMessage:",
    errorMessage,
    "statusCode:",
    statusCode
  );
  if (errorName === "CastError") {
    res.status(404).json({ message: errorMessage });
    return;
  }
  if (errorName === "SequelizeUniqueConstraintError") {
    res.status(401).json({ message: errorMessage });
    return;
  }
  res.status(statusCode).json({ message: errorMessage });
  return;
};
