import { badRequest, serverError } from "../../../helpers/http/http-helper"
import { Validation } from "../../../protocols"
import { AddSurveyController } from "./add-survey-controller"
import {
  HttpRequest,
  AddSurvey,
  AddSurveyModel,
} from "./add-survey-controller-protocols"

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  },
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurveyStub = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub,
  }
}

describe("AddSurvey Controller", () => {
  it("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, "validate")
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it("Should return 400 if validation fails", async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error())
    const httpReponse = await sut.handle(makeFakeRequest())

    expect(httpReponse).toEqual(badRequest(new Error()))
  })

  it("Should call AddSurvey with correct values", async () => {
    const { sut, addSurveyStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyStub, "add")
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it("Should return 500 if AddSurvey throws", async () => {
    const { sut, addSurveyStub } = makeSut()

    jest
      .spyOn(addSurveyStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const httpReponse = await sut.handle(makeFakeRequest())

    expect(httpReponse).toEqual(serverError(new Error()))
  })
})
