import { InvalidParamError, MissingParamError } from "../../errors"
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../helpers/http-helper"
import { LoginController } from "./login"
import { EmailValidator, HttpRequest, Authentication } from "./login-protocols"

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return "any_token"
    }
  }

  return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
})
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  }
}

describe("Login Controller", () => {
  it("Should return 400 if no email is provider", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: "any_password",
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  it("Should return 400 if no password is provider", async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  })

  it("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
  })

  it("Should 400 if an invalid email is provider", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
  })

  it("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, "auth")

    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password")
  })

  it("Should return 401 if invalid credential are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      ok({
        accessToken: "any_token",
      })
    )
  })
})