import { Express, Router } from "express"
import { readdirSync } from "fs"

export default (app: Express): void => {
  const router = Router()
  app.use("/api", router)

  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!file.includes(".test.") && !file.includes(".map")) {
      const route = await import(`../routes/${file}`)
      route.default(router)
    }
  })
}
