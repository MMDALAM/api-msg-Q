const userModel = require('../../models/user.model');
const { isValidMongoId } = require('../../utils/function');
const { profileSchema } = require('../../validators/auth.validator');
const { sendSuccess, sendError } = require("../../utils/res");
const controller = require('../contoller');

class userController extends controller {
  async findMany(req, res, next) {
    try {
      const users = await userModel.find({}, { username: 1, status: 1 }).sort({ status: -1 });
      if (users.length === 0) return sendError(res,404,"کاربر مورد نظر پیدا نشد");

      return sendSuccess(res,200,"مخاطبین یافت شده", { users: users });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidMongoId(id)) return res.status(400).json({ message: 'Invalid MongoDB ID' });
      const users = await userModel.findOneAndDelete({ _id: id });
      if (!users) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'User Deleted' });
      return sendSuccess(res,200,"مخاطب حذف شد")
    } catch (err) {
      next(err);
    }
  }

  async info(req,res,next){
    try {
      await profileSchema.validateAsync(req.body);
      const { firstName, lastName, username } = req.body;
      const user = await userModel.findById(req?.user?.id);
      if (!user) return sendError(res,404,"کاربر مورد نظر پیدا نشد");


        user.firstName = firstName ?? null;
        user.lastName = lastName ?? null;

        if (username && username !== user.username) {
          const existingUser = await userModel.findOne({ username });
          if (existingUser) return sendError(res,400,"این نام کاربری وجود دارد");
          user.username = username;
        }

      await user.save();

      return sendSuccess(res,200,"اطلاعات شما ذخیره شدند");
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new userController();
