const dotenv = require('dotenv');
dotenv.config()

const roles = {
  addmin: Number(process.env.ADDMIN),
  employment: Number(process.env.EMPLOYMENT),
  user: Number(process.env.ROLEUSER),
}

module.exports = roles
