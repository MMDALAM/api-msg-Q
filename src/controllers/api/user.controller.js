const userModel = require('../../models/user.model');
const { isValidMongoId, hashString, compareString } = require('../../utils/function');
const { profileSchema } = require('../../validators/auth.validator');
const { sendSuccess, sendError } = require("../../utils/res");
const controller = require('../contoller');
const path = require('path');
const fs = require('fs');

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

  async avatar(req, res, next) {
    try {
      
      const userId = req?.user?.id;
      const user = await userModel.findById(userId);
      const hash = await hashString();

      // حذف فایل‌های قبلی اگر وجود داشته باشند
      if (user.avatar && Array.isArray(user.avatar)) {
        for (const fileObj of user.avatar) {
          const filePath = path.resolve(path.join(fileObj.path));
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.warn(`خطا در حذف فایل: ${fileObj.path}`, err.message);
            }
          }
        }
      }

      // ساخت آرایه جدید از فایل‌های آپلود شده
      const avatars = req.files.map(file => ({
        url: `${process.env.URL_RES}QU/${hash}`,
        path:  `${req.body.fileUploadPath}/${file.filename}`,
        hash: hash,
      }));

      // به‌روزرسانی کاربر با آرایه جدید (نه $push)
      await userModel.findByIdAndUpdate(userId, {
        $set: { avatar: avatars },
      });

      return res.status(200).json({
        message: 'تصویر با موفقیت آپلود شدند.',
        avatars,
      });

    } catch (err) {
      console.log(err);
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'حجم فایل نباید بیشتر از 3 مگابایت باشد.' });

      next(err);
    }
  }

  async get_avatar(req,res,next){
    try {
      const { hash } = req.params;

      const user = await userModel.findOne({ 'avatar.hash' : hash});
      if (!user) return res.status(404).send('کاربر پیدا نشد');


      const filePath = path.resolve(path.join(user.avatar[0].path));
      if (!fs.existsSync(filePath)) return res.status(404).send('فایل پیدا نشد');
      return res.sendFile(filePath);

    } catch (err) {
      next(err)
    }
  }


}

module.exports = new userController();
