const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const queries = require('../sql/queries.js');

let checkToken = (request, reply, done, key) => {
  let token = request.headers['x-access-token'] || request.headers['authorization']; // Express headers are auto converted to lowercase
  
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, key, (err, decoded) => {
        if (err) {
          done({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          request.jwt = decoded;
          done();
        }
      });
    } else {
      done({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  } else {
    done({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let checkTokenAllUsers = (request, reply, done) => {
  return checkToken(request, reply, done, process.env.JWT_SECRET);
}

function genRandomString(length)
{
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') // convert to hexadecimal format 
          .slice(0,length);   // return required number of characters
}

module.exports = {
  checkTokenAllUsers,
  genRandomString
}
