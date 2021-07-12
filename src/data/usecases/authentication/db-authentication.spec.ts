import { AccountModel } from "../../../domain/models/accounts"
import { HashCompare } from "../../protocols/cryptography/hash-compare"
import { TokenGenerator } from "../../protocols/cryptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository"
import { DbAuthentication } from "./db-authentication"

const makeFakeAccount = () => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
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

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashCompareStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return "any_token"
    }
  }

  return new TokenGeneratorStub()
}

const makeAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
  const hashCompareStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
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

  it("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    await expect(response).rejects.toThrow()
  })

  it("Should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(null)

    const accessToken = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(accessToken).toBeNull()
  })

  it("Should call HashCompare with correct values", async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, "compare")

    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password")
  })

  it("Should throw if HashCompare throws", async () => {
    const { sut, hashCompareStub } = makeSut()
    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    await expect(response).rejects.toThrow()
  })

  it("Should return null if HashCompare returns false", async () => {
    const { sut, hashCompareStub } = makeSut()
    jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(accessToken).toBeNull()
  })

  it("Should call TokenGenerator with correct id", async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate")

    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(generateSpy).toHaveBeenCalledWith("any_id")
  })

  it("Should throw if TokenGenerator throws", async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, "generate")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    await expect(response).rejects.toThrow()
  })

  it("Should returns a token if success", async () => {
    const { sut } = makeSut()
    const response = await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(response).toBe("any_token")
  })

  it("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, "update")

    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token")
  })

  it("Should throw if UpdateAccessTokenRepositoryStub throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const response = sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    })

    await expect(response).rejects.toThrow()
  })
})
