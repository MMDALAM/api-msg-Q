const router = require('express').Router();

//****controllers****
const userController = require('../../controllers/api/user.controller');

//****middlewares****
const { verify } = require('../../middlewares/auth.widdleware');



//****RES****
router.get('/:hash' , userController.get_avatar);
router.delete('/:hash' , userController.delete_avatar);


module.exports = { resRouter: router };
