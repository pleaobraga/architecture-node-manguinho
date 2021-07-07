import { Request, Response, NextFunction } from "express"

export const contenType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.type("json")
  next()
}
