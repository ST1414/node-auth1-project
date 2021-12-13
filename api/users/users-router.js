// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router();
const User = require('../users/users-model');
const { restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength, } = require('../auth/auth-middleware');


/**
  [GET] /api/users
    This endpoint is RESTRICTED: only authenticated clients should have access.

  response-status 200
  [{ "user_id": 1, "username": "bob" }]

  response on non-authenticated - status 401
  { "message": "You shall not pass!"}
*/

router.get('/', restricted, (req, res, next) => {
  // User.find()
  //   .then( response => {
  //     console.log('ROUTER Response: ');
  //     res.send('<h1>User Router</h1>');
  //   })
  //   .catch( next );
  console.log('ROUTER Response');
  res.send('<h1>User Router</h1>');

})


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;