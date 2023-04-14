import { faker } from '@faker-js/faker'
import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError, badRequest } from '../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const fakeUser = {
  id: faker.datatype.uuid(),
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => {
  return fakeUser
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const { email, password } = fakeUser

    const httpRequest = {
      body: {
        email,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const { name, password } = fakeUser

    const httpRequest = {
      body: {
        name,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const { name, email, password } = fakeUser

    const httpRequest = {
      body: {
        name,
        email,
        passwordConfirmation: password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const { name, email, password } = fakeUser

    const httpRequest = {
      body: {
        name,
        email,
        password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const { name, email, password } = fakeUser

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: faker.internet.password()
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const { name, password } = fakeUser

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name,
        email: faker.internet.userName,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const { name, email, password } = fakeUser

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: password
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(email)
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const { name, email, password } = fakeUser

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: password
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const { name, email, password } = fakeUser

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: password
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const { name, email, password } = fakeUser

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: password
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name,
      email,
      password
    })
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const { name, email, password } = fakeUser

    const httpRequest = {
      body: {
        name,
        email,
        password,
        passwordConfirmation: password
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})

// VER AS REFATORAÇÕES DA AULA 24 - MÓDULO 8
