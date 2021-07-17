import { Collection } from "mongodb"

import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

let AccountCollection: Collection

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    AccountCollection = await MongoHelper.getCollection("accounts")
    await AccountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it("Should return an account on add success", async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email@email.com")
    expect(account.password).toBe("any_password")
  })

  it("Should return an account on loadByEmail success", async () => {
    const sut = makeSut()

    await AccountCollection.insertOne({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    })

    const account = await sut.loadByEmail("any_email@email.com")

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe("any_name")
    expect(account.email).toBe("any_email@email.com")
    expect(account.password).toBe("any_password")
  })

  it("Should return null if loadByEmail fails", async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail("any_email@email.com")
    expect(account).toBeFalsy()
  })
})
