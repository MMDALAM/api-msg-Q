const JWT = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { sendError, sendSuccess } = require('../utils/res');

exports.verifyUser = async (req, res, next) => {
  try {
    const token = req?.headers?.qtoken;
    if (!token) return sendError(res,403,'خطا در شناسایی کاربر' );
    

    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_USER , async (err, paylod) => {
      if (err) return sendError(res,403,'خطا در شناسایی کاربر' );
      const user = await userModel.findById(paylod.id, { __v: 0, updatedAt: 0 , otp:0 });
      if (!user)return sendError(res,403,'خطا در شناسایی کاربر' );
      if (user.token === token) return sendSuccess(res,200,'دسترسی مجاز', user);
      return sendError(res,403,'خطا در شناسایی کاربر' );
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const token = req?.headers?.qtoken;
    if (!token) return sendError(res,403,'خطا در شناسایی کاربر' );

    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_USER, async (err, paylod) => {
      if (err) return sendError(res,403,'خطا در شناسایی کاربر' );
      const user = await userModel.findById(paylod.id, { __v: 0, updatedAt: 0 });
      if (!user) return sendError(res,403,'خطا در شناسایی کاربر' );
      if (user?.token === token){
        req.user = user;
        next();
      }
      else return sendError(res,403,'خطا در شناسایی کاربر' );
    });
  } catch (err) {
    next(err);
  }
};
