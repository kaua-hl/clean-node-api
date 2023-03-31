import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = faker.internet.userName()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })
})
