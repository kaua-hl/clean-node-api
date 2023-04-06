export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/clean-node-api?authSource=admin',
  port: process.env.PORT || 5050
}
