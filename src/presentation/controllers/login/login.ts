import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok } from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"
import { EmailValidator } from "../../protocols/email-validator"

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ["email", "password"]

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field))
    }

    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)

    if (!isValid) {
      return badRequest(new InvalidParamError("email"))
    }

    return ok(true)
  }
}
