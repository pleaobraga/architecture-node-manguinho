import { MissingParamError } from "../../errors"
import { badRequest } from "../../helpers/http-helper"
import { LoginController } from "./login"

const makeSut = () => {
  return new LoginController()
}

describe("Login Controller", () => {
  it("Should return 400 if no email is provider", async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: "any_password",
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  })

  it("Should return 400 if no password is provider", async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
      },
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  })
})
