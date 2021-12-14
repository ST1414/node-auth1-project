const User = require('../users/users-model')

/*
  If the user does not have a session saved in the server
  status 401: { "message": "You shall not pass!" }
*/
function restricted (req, res, next) {
  // 1- it checked response for a COOKIE header
  // 2- pulled session id from it
  // 3- checked if live session by that id
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: 'You shall not pass!' }) // Why not res.status(401).json({ status: 401, message: 'not allowed!' })
  }
}


/* REGISTER
  If the username in req.body already exists in the database
  status 422: { "message": "Username taken" }
*/
function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  User.findBy({ username })
    .then (response => {
      if (response.length === 0) {
        next();
      } else {
        res.status(422).json({ message: "Username taken" })
      }
    })
    .catch(next);
}



/* LOGIN
  If the username in req.body does NOT exist in the database
  status 401: { "message": "Invalid credentials" }
*/
async function checkUsernameExists(req, res, next) {
  try {
    // 1- pull username from req.body
    // 2- pull the user form the db using the username
    // * If user doesn't exist, return 401
    const { username } = req.body;
    const [ userFromDb ] = await User.findBy({ username });
    
    if ( userFromDb === undefined ){
      // res.status(401).json({ "message": "Invalid credentials" })
      // next();
      return next({ status: 401, message: "Invalid credentials" });
    } else {
      req.userFromDb = userFromDb;
    }

  } catch (error) {
    next(error);
  }
}



/* REGISTER
  If password is missing from req.body, or if it's 3 chars or shorter
  status 422: { "message": "Password must be longer than 3 chars" }
*/
function checkPasswordLength(req, res, next) {
  console.log('checkPasswordLength');
  const password = req.body.password
  if ( password === undefined || password.length <= 3 ){
    res.status(422).json({ message: "Password must be longer than 3 chars" });
  } else {
    next();
  }

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
}