import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpResponse, httpRequest } from "../protocols/http"

export class SignUpController {
  handle(httpRequest: httpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"]

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field))
    }
  }
}
