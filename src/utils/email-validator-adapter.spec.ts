import { faker } from '@faker-js/faker'
import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.internet.userName())
    expect(isValid).toBe(false)
  })
})
