import { faker } from '@faker-js/faker'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve(faker.random.word()) })
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const password = faker.internet.password()
    const accountData = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(password)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const password = faker.internet.password()
    const accountData = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
