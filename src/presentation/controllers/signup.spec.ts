import { faker } from '@faker-js/faker'
import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: faker.name.firstName(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
