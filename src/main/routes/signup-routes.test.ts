import request from "supertest"

import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper"
import app from "../config/app"

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const AccountCollection = await MongoHelper.getCollection("accounts")
    await AccountCollection.deleteMany({})
  })

  it("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Pedro",
        email: "pleao.braga@test.com",
        password: "1234",
        passwordConfirmation: "1234",
      })
      .expect(200)
  })
})
