import * as mongoose from 'mongoose'

export const connectToDB = async () => {
  try {
    return mongoose.connect(process.env.MONGO_URL as string)
  } catch (error) {
    console.log(error)
  }
}
