import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication"
import { HashCompare } from "../../protocols/cryptography/hash-compare"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashCompare

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )

    if (!account) {
      return null
    }

    await this.hashCompare.compare(authentication.password, account.password)
    return null
  }
}
