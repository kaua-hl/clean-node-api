import { faker } from '@faker-js/faker'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountRepository } from '../../protocols/add-account-repository'

const fakeData = {
  id: faker.datatype.uuid(),
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  hash: faker.random.word()
}

const { id, name, email, password, hash } = fakeData

const makeFakeAccount = (): AccountModel => {
  return {
    id,
    name,
    email,
    password
  }
}

const makeFakeAccountData = (value?: string): AddAccountModel => {
  return {
    name,
    email,
    password: value
  }
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve(hash) })
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  AddAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const AddAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, AddAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    AddAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const password = faker.internet.password()
    await sut.add(makeFakeAccountData(password))
    expect(encryptSpy).toHaveBeenCalledWith(password)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountData(password))
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(AddAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password: hash
    })
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    jest.spyOn(AddAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
