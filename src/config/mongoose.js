import mongoose from 'mongoose'
/**
 * Establishes a connection to a databse.
 *
 * @returns {Promise} Resolves to this if connection succeed.
 */
export const connectDB = async () => {
  // Bind connection to events.
  mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
  mongoose.connection.on('error', err => console.error(`Mongoose connection error has occured: ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection is disconnected due to application termination')
      process.exit(0)
    })
  })

  // Connect to the server.
  return mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
