import { AddSurveyRepository } from "../../protocols/db/survey/add-survey-repository"
import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyModel } from "./db-add-survey-protocols"

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer",
    },
  ],
})

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }

  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  addSurveyRepositoryStub: AddSurveyRepository
  sut: DbAddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    addSurveyRepositoryStub,
    sut,
  }
}

describe("DbAddSurvey UseCase", () => {
  it("Should call AddSurveyRepository with correct values", async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyRepositoryStub, "add")

    const surveyData = makeFakeSurveyData()

    await sut.add(surveyData)

    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
