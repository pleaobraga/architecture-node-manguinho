import { Request, Response } from "express"

import { Controller, HttpRequest } from "../../presentation/protocols"

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }
    const { statusCode, body } = await controller.handle(httpRequest)
    res.status(statusCode).json(body)
  }
}
