const router = require('express').Router();
const jwtutil = require('../jwtutil.js');

let user_root         = require('./user.js');
let users_root         = require('./users.js');

router.use( '/users', jwtutil.checkTokenForAdmin, users_root);
router.use( '/user', jwtutil.checkTokenAllUsers, user_root);

module.exports = router;
