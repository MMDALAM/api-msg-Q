const userModel = require("../../models/user.model");
const { jwtSign, randomCode } = require("../../utils/function");
const { sendSuccess, sendError } = require("../../utils/res");
const { getotpSchema, authSchema } = require("../../validators/auth.validator");
const controller = require("../contoller");

module.exports = new (class authController extends controller {
  async getOtp(req, res, next) {
    try {
      await getotpSchema.validateAsync(req.body);
      const { phone } = req.body;
      const code = randomCode();
      const user = await this.checkExistUser(phone);


      const date = Date.now();
      if (user) {
        if (user.otp?.expiresIn && date <= user.otp.expiresIn)
          return sendError(res,401,"کد ورود به تازگی برای شما ارسال شده، لطفا صبر کنید");

        await this.updateOtpForUser(phone, code);
      } else await this.register(phone, code);

      return sendSuccess(res,200,"کد یک بار مصرف برای شما ارسال شد ", {
          code: code,
          expire: date + 120000,
          phone,
        })
    } catch (err) {
      next(err);
    }
  }

  async auth(req, res, next) {
    try {
      await authSchema.validateAsync(req.body);
      const { phone, code } = req.body;
      const user = await userModel.findOne({ phone });

      if (!user) return sendError(res,401,"کاربر یافت نشد");
      if (Date.now() > user.otp.expiresIn) return sendError(res,401,'کد منقضی شده است');
      if (user.otp.code !== parseInt(code))  return sendError(res,401,"کد صحیح نیست");
      if (!user || !user.otp) return sendError(res,401,"کاربر یا کد تایید یافت نشد");

      if (isNaN(code) || parseInt(code) !== user.otp.code)  return sendError(res,401,"کد صحیح نیست");

      await this.sendAuthResponse(res, user, "ورود موفقیت‌آمیز بود");
    } catch (err) {
      next(err);
    }
  }

  async register(phone, code) {
    const otp = { code, expiresIn: Date.now() + 120000 };
    return await userModel.create({ phone, otp, roles: "USER" });
  }

  async checkExistUser(phone) {
    return await userModel.findOne({ phone });
  }

  async updateOtpForUser(phone, code) {
    const otp = { code, expiresIn: Date.now() + 120000 };
    return (
      (await userModel.updateOne({ phone }, { $set: { otp } })).modifiedCount >
      0
    );
  }

  async sendAuthResponse(res, user, message) {

    const accessToken = await jwtSign(user.id);

    return res.status(200).json({
      status: 'success',
      message,
      accessToken,
      data: {
        phone: user.phone,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  }
})();
