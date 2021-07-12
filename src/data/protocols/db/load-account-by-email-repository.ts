import { AccountModel } from "../../../domain/models/accounts"

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>
}
