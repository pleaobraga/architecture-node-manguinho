/* eslint-disable no-restricted-syntax */

import { Validation } from "../../../../presentation/protocols/validation"
import { EmailValidator } from "../../../../validation/protocols/email-validator"
import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from "../../../../validation/validators"
import { makeLoginValidation } from "./login-validation-factory"

jest.mock("../../../../validation/validators/validation-composite")

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe("LoginValidation Factory", () => {
  it("Should call ValidationComposite with all validations", () => {
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ["email", "password"]) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation("email", makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith([...validations])
  })
})
