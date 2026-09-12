const express = require('express');
const { verifyTokenMiddleware } = require('../middlewares/verifyToken');
const { updateProfileController } = require('../controllers/userController');

const router = express.Router();

router.use(verifyTokenMiddleware);
router.put('/profile', updateProfileController);

module.exports = router;
