import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-repository'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup'
import { Controller } from '../../presentation/protocols/controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
