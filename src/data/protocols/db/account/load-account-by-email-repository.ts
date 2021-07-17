import { AccountModel } from "../../../domain/models/accounts"

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>
}
