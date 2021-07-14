import {
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel,
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashCompare
  private readonly encrypter
  private readonly updateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
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

    const accessToken = await this.encrypter.encrypt(account.id)

    if (!accessToken) {
      return null
    }

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
