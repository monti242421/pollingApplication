const express = require("express");
const router = express.Router();
const usercontroller = require('../controller/usercontroller');
const userautherization = require('../middleware/auth');


router.post('/user/adduser',usercontroller.addUser)
router.post('/user/login',usercontroller.login)


module.exports = router;