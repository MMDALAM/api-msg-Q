const controller = require('../contoller');
const { isValidMongoId } = require('../../utils/function');
const qrngModel = require('../../models/qrng.model');

class keyController extends controller {
  async findKey(req, res, next) {
    try {
      const { id } = req.params;
      if (!isValidMongoId(id)) return res.status(200).json({ message: 'Not Valid MongoDB' });

      const key = await qrngModel.findById(id, { createdAt: 0, updatedAt: 0, __v: 0 }).populate('roomId', ['title', 'qrng']);

      return res.status(200).json({ key: key });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new keyController();
