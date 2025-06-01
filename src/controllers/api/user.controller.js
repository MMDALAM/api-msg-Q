const userModel = require('../../models/user.model');
const { isValidMongoId } = require('../../utils/function');
const { profileSchema } = require('../../validators/auth.validator');
const controller = require('../contoller');

class userController extends controller {
  async findMany(req, res, next) {
    try {
      const users = await userModel.find({}, { username: 1, status: 1 }).sort({
        status: -1,
      });
      if (!users) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ users: users });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidMongoId(id)) return res.status(200).json({ message: 'Not Valid MongoDB' });
      const users = await userModel.findOneAndDelete({ _id: id });
      if (!users) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ message: 'User Deleted' });
    } catch (err) {
      next(err);
    }
  }

  async info(req,res,next){
    try {
      await profileSchema.validateAsync(req.body);
      const { firstName, lastName, username } = req.body;
      const user = await userModel.findById(req?.user?._id);


      if(firstName)
        (firstName) ? user.firstName = firstName : "";

      if(lastName)
        (lastName) ? user.lastName = lastName : "";

      if(username){
        (username) ? user.username = username : "";
        const usernames = await userModel.findOne({username});
        if (usernames) return res.status(404).json({ message: 'Username exists.' });
      }

      await user.save();

      return res.status(200).json({ message: 'success save information' });
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new userController();
