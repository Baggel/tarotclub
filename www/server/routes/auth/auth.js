
const router = require('express').Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const queries = require('../../sql/queries.js');
const mailer = require('../../mailer/mailer.js');
const AccessUtil = require("../accessutil.js");
const JwtUtil = require("../jwtutil.js");

function saltPassword(password)
{
  let salt = JwtUtil.genRandomString(16);
  const key1 = crypto.scryptSync(password, salt, 20);
  const key2 = key1.toString('hex');

  return salt + key2;
}

router.post('/signup', (req, res) => {

    console.log("[AUTH] Signup called");

    queries.getUserByUsernameOrEmail(req.body.username, req.body.email).then( function (data) {

      // Le champs potmiel est un pot de miel anti-bots, il doit être vide ; on en n'a pas besoin ici :D
      if ((data.length == 0) && (req.body.potmiel == '')) {

          queries.createUser(req.body.username, req.body.email, saltPassword(req.body.password))
          .then(function (data) {

             // Create JWT
            const user = {
                id: data.insertId,
                username: req.body.username,
                status: 0
            };
            
            jwt.sign ({user: user}, process.env.JWT_SECRET, (err, token) => {
              console.log("[AUTH] Signup success");
                  res.status(200).json({
                    success: true,
                    message: 'Created one user'
                });
            })
          })
          .catch(function (err) {
              console.log("[AUTH] Signup failure: " + err.message);
              res.status(200).json({
                  success: false,
                  message: err.message
              });
          });

      // -------------   here, username exists
      } else {
        res.status(200).json({
            success: false,
            message: 'username exists'
        });
      }
    }).catch(function (err) {
      console.log("[AUTH] Get username failure: " + err.message);
      res.status(200).json({
          success: false,
          message: err.message
      });
    });
});

router.post('/signin', (req, res) => {

  queries.getUserByUsername(req.body.username).then( function (data) {

    if (data.length > 0) {
      if (AccessUtil.isActive(data[0].status)) {
          let passSalt = data[0].password.substr(0,16); // extract salt
          let key4 = crypto.scryptSync(req.body.password, passSalt, 20);
          let key5 = key4.toString('hex');

          if (data[0].password === (passSalt + key5)) {
            // Create JWT
            const user = {
              id: data[0].id,
              username: req.body.username,
              status: data[0].status,
            };

            jwt.sign ({user: user}, process.env.JWT_SECRET, (err, token) => {
              console.log("[AUTH] Signin success");
              res.status(200).json({
                  success: true,
                  data: {
                      token: token,
                      profile: {
                        firstname: data[0].firstname,
                        lastname: data[0].lastname,
                        tel: data[0].tel,
                        company: data[0].company,
                        status: data[0].status,
                        created: data[0].created,
                        email: data[0].email
                      }
                  },
                  message: 'Signed in user ' + req.body.username
              });
            })
          } else {
            console.log("[AUTH] Signin failure");
            res.status(200).json({
                success: false,
                reason: 'credentials',
                message: 'Bad username or password'
            });
          }
      } else {
        console.log("[AUTH] Signin failure");
        res.status(200).json({
            success: false,
            reason: 'deleted',
            message: 'Bad username or password'
        });
      }
        
    } else {
      console.log("[AUTH] Signin failure");
      res.status(200).json({
          success: false,
          reason: 'unknown',
          message: 'Bad username or password'
      });
    }
    

  }).catch(function (err) {
    console.log("[AUTH] Signin failure: " + err.message);
    res.status(200).json({
        success: false,
        message: err.message
    });
  });

});

router.post('/resetpassword', (req, res) => {

  if (!req.body.username) {
      res.status(200).json({
        success: false,
        message: 'username required'
      });
  } else {
    queries.getUserByUsername(req.body.username).then( function (data) {

      if (data.length > 0) {
        if (AccessUtil.isActive(data[0].status)) {
        // create reset token for that user
        let reset_token = crypto.randomBytes(20).toString('hex');

        queries.setResetToken(data[0].id, reset_token).then(function () {
            // Ok, now send mail to user with the tocken

            // console.log(req.headers.host);

            mailer.sendMail(
              data[0].email,
              'Monnaie de Paris - Nouveau mot de passe',
              'Vous recevez cet email parque que vous avez demandé une ré-initialisation de votre mot de passe.\n\n' +
              'Merci de copier-coller le lien suivant dans votre navigateur pour continuer le processus :\n\n' + req.headers.host +
              '/newpassword/' + reset_token + '\n\n' +
              "Si vous n'êtes pas à l'origine de cette action, ignorez simplement cet email, votre mot de passe restera inchangé.\n"
            ).then( function() {

              res.status(200).json({
                  success: true,
                  message: 'email sent'
              });

            }).catch(function(error, info) {
              
              res.status(200).json({
                  success: false,
                  message: error
              });

            });

        }).catch(function (err) {
          console.log("[AUTH] set reset token failure: " + err.message);
          res.status(200).json({
              success: false,
              message: err.message
          });
        });

      } else {
        res.status(200).json({
            success: false,
            message: 'Account not validated'
        });
      }
        
    } else {
      res.status(200).json({
          success: false,
          message: 'Unknown mail address'
      });
    }
      

    }).catch(function (err) {
      console.log("[AUTH] get email failure: " + err.message);
      res.status(200).json({
          success: false,
          message: err.message
      });
    });
    
  }

});

router.post('/newpassword', (req, res) => {

  console.log("[AUTH] Token called");

  if ((req.body.honeypot === '') && (req.body.human === true)) {

    queries.getUserByResetToken(req.body.token).then( function (data) {

        if (data.length > 0) {

          let timeout = new Date(data[0].reset_password_datetime);
          let now = new Date();
          if (AccessUtil.isActive(data[0].status) && (timeout > now)) {

            queries.setNewPassword(data[0].id, saltPassword(req.body.password)).then(function () {
                
              res.status(200).json({
                  success: true,
                  message: 'Password changed'
              });

          }).catch(function (err) {
            console.log("[AUTH] set reset token failure: " + err.message);
            res.status(200).json({
                success: false,
                message: err.message
            });
          });

        } else {
          res.status(200).json({
              success: false,
              message: 'Account not validated or timeout'
          });
        }
          
      } else {
        res.status(200).json({
            success: false,
            message: 'Unknown mail address'
        });
      }
      

    }).catch(function (err) {
      console.log("[AUTH] get email failure: " + err.message);
      res.status(200).json({
          success: false,
          message: err.message
      });
    });

  } else {
    console.log("[AUTH] Bot");
  }


});




module.exports = router;
