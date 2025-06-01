const userModel = require('../../models/user.model');
const { jwtSign, randomCode } = require('../../utils/function');
const { getotpSchema, authSchema } = require('../../validators/auth.validator');
const controller = require('../contoller');


module.exports = new class authController extends controller  {
  async getOtp(req, res, next) {
    try {
      await getotpSchema.validateAsync(req.body);
      const { phone } = req.body;
      const code = randomCode();
      const user = await this.checkExistUser(phone);

      if (user) await this.updateOtpForUser(phone, code);
      else await this.register(phone, code);

      const date = Date.now();


      // if (user && user.otp?.expiresIn && date <= user.otp.expiresIn) {
      //   return res.status(400).json({
      //     data: { message: 'کد ورود به تازگی برای شما ارسال شده، لطفا صبر کنید' }
      //   });
      // }


      return res.status(200).json({
        data: {
          code: code,
          expire: date + 120000,
          phone,
        }
      });

    } catch (err) {
      next(err);
    }
  }

  async auth(req, res, next) {
    try {
      await authSchema.validateAsync(req.body);
      const { phone, code } = req.body;
      const user = await userModel.findOne({ phone });

      const date = Date.now();

      if (!user) return res.status(401).json({message:'کاربر یافت نشد'});
      if (date > user.otp.expiresIn) return res.status(401).json({message:'کد منقضی شده است'});
      if (user.otp.code !== parseInt(code)) return res.status(401).json({message:'کد صحیح نیست'}); 

      await this.sendAuthResponse(res, user, 'ورود موفقیت‌آمیز بود');
    } catch (err) {
      next(err);
    }
  }

  async register(phone, code) {
    const date = Date.now();
    const otp = { code, expiresIn: date + 120000 };
    return await userModel.create({ phone, otp, roles: 'USER'});
  }

  async checkExistUser(phone) {
    return await userModel.findOne({ phone });
  }

  async updateOtpForUser(phone, code) {
    const date = Date.now();
    const otp = { code, expiresIn: date + 120000 };
    return (await userModel.updateOne({ phone }, { $set: { otp } })).modifiedCount > 0;
  }

  async sendAuthResponse(res, user, message ) {
    const accessToken = await jwtSign(user.id);

    return res.status(200).json({ 
      status: 'success', 
      accessToken,
      data: { phone : user.phone, username : user.username ,firstName : user.firstName,lastName : user.lastName ,message}
    });
  }
};