require('dotenv').config();
const {SECRET_KEY} = process.env
var jwt = require('jsonwebtoken')

const generateToken = (RoleId) => {
  return jwt.sign({ RoleId }, SECRET_KEY, {
    expiresIn: '30d',
  })
}

module.exports = generateToken
