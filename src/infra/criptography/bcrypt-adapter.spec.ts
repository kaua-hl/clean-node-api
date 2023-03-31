import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = faker.internet.password()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  it('Should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const password = faker.internet.password()
    const hash = await sut.encrypt(password)
    expect(hash).toBe(hash)
  })
})
