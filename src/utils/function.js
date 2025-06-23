const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const crypto = require('crypto');

function hashString() {
  return crypto.createHash('sha1').digest('hex').substring(0, 18);
}

function jwtSign(id) {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(id);
    JWT.sign({ id: id }, process.env.JWT_ACCESS_TOKEN_SECRET_USER, { expiresIn: '1y' }, async (err, token) => {
      if (err) reject(err.message);
      user.token = token;
      await user.save();
      resolve(token);
    });
  });
}

async function hashPassword(password) {
  const hashstring = await bcrypt.hashSync(password, 10);
  return hashstring;
}

async function comparePassword(password, hash) {
  return await bcrypt.compareSync(password, hash);
}

function randomCode() {
  return Math.floor(Math.random() * 90000 + 10000);
}

async function isValidMongoId(id) {
  if (!id) return false;
  if (id.length !== 24) return false;
  const hexRegex = /^[0-9a-fA-F]{24}$/;
  if (hexRegex.test(id)) return true;
  return false;
}

module.exports = { jwtSign, hashString,hashPassword ,comparePassword, isValidMongoId ,randomCode};
