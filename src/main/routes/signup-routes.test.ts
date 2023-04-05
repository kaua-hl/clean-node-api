import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Kauã',
        email: 'kaua@gmail.com',
        password: '123444',
        passwordConfirmation: '123444'
      })
      .expect(200)
  })
})
