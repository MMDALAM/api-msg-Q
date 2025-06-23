const router = require('express').Router();

//****controllers****
const userController = require('../../controllers/api/user.controller');
//****utils****
const uploadImg = require('../../utils/uploadImg');
//****middlewares****
const { verify } = require('../../middlewares/auth.widdleware');


//****user****
router.get('/', verify, userController.findMany);
router.delete('/:id', verify, userController.delete);
router.post('/info', verify, userController.info);
router.post('/avatar', verify,uploadImg.array('images', 5),userController.avatar);

module.exports = { userRouter: router };
