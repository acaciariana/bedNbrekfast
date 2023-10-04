const mongoose = require('mongoose')
require('dotenv').config();

const dbConnect = async() => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log(`Connected ${connected.host}`)
  } catch (error) {
    console.log(`error : ${error.message}`)
  }
}
module.exports = {
  dbConnect
}