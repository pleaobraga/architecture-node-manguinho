export interface Hasher {
  hash(svalue: string): Promise<string>
}
