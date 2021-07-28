import { InvalidParamError } from "../../presentation/errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

describe("CompareFields Validation", () => {
  it("Should return A MissingParam error if validation fails", () => {
    const sut = new CompareFieldsValidation("field", "fieldToCompare")
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "wrong_value",
    })
    expect(error).toEqual(new InvalidParamError("fieldToCompare"))
  })

  it("Should not return if validation succeeds", () => {
    const sut = new CompareFieldsValidation("field", "fieldToCompare")
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    })
    expect(error).toBeFalsy()
  })
})
