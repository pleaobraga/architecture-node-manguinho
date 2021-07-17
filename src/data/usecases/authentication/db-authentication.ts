import {
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel,
} from "./db-authentication-protocols"

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
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

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    )

    return accessToken
  }
}
