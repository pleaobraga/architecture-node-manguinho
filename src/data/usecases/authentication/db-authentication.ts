import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication"
import { HashCompare } from "../../protocols/cryptography/hash-compare"
import { TokenGenerator } from "../../protocols/cryptography/token-generator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository"

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashCompare
  private readonly tokenGenerator
  private readonly updateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )

    if (!account) {
      return null
    }

    const isValid = await this.hashCompare.compare(
      authentication.password,
      account.password
    )

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(account.id)

    if (!accessToken) {
      return null
    }

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
