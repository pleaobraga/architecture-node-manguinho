import { AccountModel } from "../../../domain/models/accounts"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = () => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
})

const makeLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  }
}

describe("DbAuthentication UseCase", () => {
  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load")
    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(loadSpy).toHaveBeenCalledWith("any_email@mail.com")
  })
})
