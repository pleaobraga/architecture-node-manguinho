import { Express } from "express"

import { bodyParser } from "../middlewares/body-parser"
import { contenType } from "../middlewares/content-type"
import { cors } from "../middlewares/cors"

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contenType)
}
