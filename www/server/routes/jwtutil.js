let jwt = require('jsonwebtoken');
const crypto = require('crypto');
const queries = require('../sql/queries.js');

let checkToken = (req, res, next, minLevel, key) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, key, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.jwt = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let checkTokenForAdmin = (req, res, next) => {
  return checkToken(req, res, next, 100, process.env.JWT_SECRET);
}

let checkTokenForAdminOrMaintenance = (req, res, next) => {
  return checkToken(req, res, next, 2, process.env.JWT_SECRET);
}

let checkTokenAllUsers = (req, res, next) => {
  return checkToken(req, res, next, 0, process.env.JWT_SECRET);
}

let checkTokenForServers = (req, res, next) => {
  return checkToken(req, res, next, 0, process.env.JWT_SERVER_SECRET);
}

let checkIotAccess = (req, res, next) => {
  
  let apiKey = req.headers['authorization']; // Express headers are auto converted to lowercase
  

  if (apiKey) {

    if (apiKey.startsWith('ApiKey-v1 ')) {
      // Remove apiKey from string
      apiKey = apiKey.slice(10, apiKey.length);
    }
    queries.getMachineId(apiKey)
    .then(function (data) {

      if (data.length == 1) {
          req.machine_id = data[0].id;
          next();
      } else {
        console.log("[UPSTREAM] Api key not found: " + apiKey);
      }
        
    }).catch(function (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    });
  }
}

function genRandomString(length)
{
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') // convert to hexadecimal format 
          .slice(0,length);   // return required number of characters
}

module.exports = {
  checkTokenForAdmin,
  checkTokenForAdminOrMaintenance,
  checkTokenAllUsers,
  checkIotAccess,
  genRandomString,
  checkTokenForServers
}
