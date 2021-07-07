import express from "express"

import setupMiddlewares from "./middlewares"
import setupRoutes from "./route"

const app = express()
setupMiddlewares(app)
setupRoutes(app)

export default app
