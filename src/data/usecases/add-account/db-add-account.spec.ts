import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { DbAddAccount } from "./db-add-account"
import {
  Hasher,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols"

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "hashed_password",
})

const makeLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"))
    }
  }

  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountRepositoryStub()
}

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
})

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmail()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  }
}

describe("DbAddAccount UseCase", () => {
  test("Should call Hasher with correct password", async () => {
    const { hasherStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, "hash")

    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })

  test("Should throw if Hasher throws", async () => {
    const { hasherStub, sut } = makeSut()
    jest.spyOn(hasherStub, "hash").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test("Should call AddAccountRepository with correct values", async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "hashed_password",
    })
  })

  test("Should throw if AddAccountRepository throws", async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test("Should return an Account on success", async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })

  it("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
    await sut.add(makeFakeAccount())

    expect(loadSpy).toHaveBeenCalledWith("valid_email@email.com")
  })
})
