const JWT = require('jsonwebtoken');
const userModel = require('../models/user.model');

exports.verifyUser = async (req, res, next) => {
  try {

    const token = req?.headers?.qtoken;
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });
    

    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_USER , async (err, paylod) => {
      if (err) return res.status(403).json({ message: 'Invalid token.' });
      const user = await userModel.findById(paylod.id, { __v: 0, updatedAt: 0 , otp:0 });
      if (!user) return res.status(403).json({ message: 'Invalid token.' });
      if (user.token === token) return res.status(200).json({ message: 'Token is valid', user: user });
      return res.status(403).json({ message: 'Token is not match' });
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const token = req?.headers?.qtoken;
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_USER, async (err, paylod) => {
      if (err) return res.status(403).json({ message: 'Invalid token.' });
      const user = await userModel.findById(paylod.id, { __v: 0, updatedAt: 0 });
      if (!user) return res.status(403).json({ message: 'Not fund user.' });
      if (user?.token === token){
        req.user = user; 
        next();
      }
      else return res.status(403).json({ message: 'Token is not match' });
    });
  } catch (err) {
    next(err);
  }
};
