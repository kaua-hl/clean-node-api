import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(password)
    expect(hashSpy).toHaveBeenCalledWith(password, salt)
  })

  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const hash = await sut.encrypt(password)
    expect(hash).toBe(hash)
  })

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
    const password = faker.internet.password()
    const promise = sut.encrypt(password)
    await expect(promise).rejects.toThrow()
  })
})
