import { MissingParamError } from "../errors/missing-param-error"
import { HttpResponse, httpRequest } from "../protocols/http"

export class SignUpController {
  handle(httpRequest: httpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError("name"),
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError("email"),
      }
    }
  }
}
