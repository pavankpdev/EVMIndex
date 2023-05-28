import * as mongoose from 'mongoose'

export const connectToDB = async (uri: string) => {
  try {
    if(!uri) throw new Error('MonoDB URI not provided')
    return mongoose.connect(uri)
  } catch (error) {
    console.log(error)
  }
}
