import { faker } from '@faker-js/faker'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'

const user = {
  id: faker.datatype.uuid(),
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('Should return an account on success', async () => {
    const sut = makeSut()
    const { name, email, password } = user

    const account = await sut.add({
      name,
      email,
      password
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(name)
    expect(account.email).toBe(email)
    expect(account.password).toBe(password)
  })
})
