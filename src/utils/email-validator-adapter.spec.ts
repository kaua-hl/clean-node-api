import { faker } from '@faker-js/faker'
import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid(faker.internet.userName())
    expect(isValid).toBe(false)
  })

  it('Should return false if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid(faker.internet.email())
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct email', () => {
    const sut = makeSut()
    const email = faker.internet.email()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
