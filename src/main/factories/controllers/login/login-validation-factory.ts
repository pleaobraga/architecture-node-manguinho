/* eslint-disable no-restricted-syntax */

import { EmailValidatorAdapter } from "../../../../infra/validators/email-validator-adapter"
import { Validation } from "../../../../presentation/protocols"
import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from "../../../../validation/validators"

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ["email", "password"]) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation("email", new EmailValidatorAdapter()))

  return new ValidationComposite([...validations])
}
