const express = require("express");
const router = express.Router();
const votescontroller = require('../controller/votescontroller');
const userautherization = require('../middleware/auth');

router.get('/votes/getvotes',userautherization.authenticate,votescontroller.getVotes);

module.exports = router;