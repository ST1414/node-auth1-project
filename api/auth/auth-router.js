// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const User = require('../users/users-model');
const bcryptjs = require('bcryptjs')
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware');


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200: { "user_id": 2, "username": "sue" }

  response on username taken:
  status 422: { "message": "Username taken" }

  response on password three chars or less:
  status 422: { "message": "Password must be longer than 3 chars" }
 */

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  
  // 1- pull u and p from req.body
  // 2- create a hash off of the password
  // 3- we will store u and hash to the db
  try {
    const { username, password } = req.body;
    const newUser = {
      username: username,
      password: bcryptjs.hashSync(password, 8), // 2^8 rounds of hashing
    }
    const createdUser = await User.add(newUser);
    res.status(201).json({ username: createdUser.username, user_id: createdUser.user_id});

  } catch (error) {
     next(error);
  }
})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
  response => status 200: { "message": "Welcome sue!" }
  response on invalid credentials => status 401: { "message": "Invalid credentials" }
 */
router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    // 0- Middleware checks for username existing; adds user info from DB to the req
    // 1- pull username, pwd, and userFromDb from req.body

    const { username, password } = req.body;
    const userFromDb = req.userFromDb;
    
    // 3- recreate the hash using password from req.body
    // 4- compare this against the hash in the database
    // * If pwd doesn't match, return 401
    const verifyUserHash = bcryptjs.compareSync(password, userFromDb.password);
    if (!verifyUserHash){
      // res.status(401).json({ "message": "Invalid credentials" })
      // next();
      return next({ status: 401, message: "Invalid credentials" });
    }

    // 5- start a session with the logged-in user by writing something to the req.session
    //    (a) a session gets created (b) a SET-COOKIE header gets tacked to the response (with session ID)
    req.session.user = userFromDb;
    res.json({ message: `Welcome ${username}!`});

  } catch (error) {
    next(error);
  }

})


/**
  3 [GET] /api/auth/logout
  response for logged-in users => status 200: { "message": "logged out" }
  response for not-logged-in users => status 200: { "message": "no session"}
 */
router.get('/logout', async (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          res.status(200).json('no session')
        } else {
          res.status(200).json({ message: 'logged out' })
        }
      })
    } else {
      res.status(200).json({ message: 'no session' })
    }
  } catch (err) {
    next(err)
  }
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;