
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const queries = require('../../sql/queries.js');
const mailer = require('../../mailer/mailer.js');
const AccessUtil = require("../accessutil.js");
const jwtUtil = require("../jwtutil.js");

function saltPassword(password)
{
  let salt = jwtUtil.genRandomString(16);
  const key1 = crypto.scryptSync(password, salt, 20);
  const key2 = key1.toString('hex');

  return salt + key2;
}

function signUp(req, reply)
{
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
                  reply.code(200).send({
                    success: true,
                    message: 'Created one user'
                });
            })
          })
          .catch(function (err) {
              console.log("[AUTH] Signup failure: " + err.message);
              reply.code(200).send({
                  success: false,
                  message: err.message
              });
          });

      // -------------   here, username exists
      } else {
        reply.code(200).send({
            success: false,
            message: "Le nom d'utilisateur existe"
        });
      }
    }).catch(function (err) {
      console.log("[AUTH] Get username failure: " + err.message);
      reply.code(200).send({
          success: false,
          message: err.message
      });
    });
}

function signIn(req, reply)
{
  queries.getUserByUsernameOrEmail(req.body.login).then( (data) => {

    if (data.length > 0) {
      if (AccessUtil.isActive(data[0].status)) {
          let passSalt = data[0].password.substr(0,16); // extract salt
          let key4 = crypto.scryptSync(req.body.password, passSalt, 20);
          let key5 = key4.toString('hex');

          if (data[0].password === (passSalt + key5)) {
            // Create JWT
            const user = {
              id: data[0].id,
              username: data[0].username,
              email: data[0].email,
              status: data[0].status,
            };

            jwt.sign ({user: user}, process.env.JWT_SECRET, (err, token) => {
              console.log("[AUTH] Signin success");
              reply.code(200).send({
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
                  message: 'Signed in user ' + data[0].username
              });
            })
          } else {
            console.log("[AUTH] Signin failure");
            reply.code(200).send({
                success: false,
                reason: 'credentials',
                message: 'Bad username or password'
            });
          }
      } else {
        console.log("[AUTH] Signin failure");
        reply.code(200).send({
            success: false,
            reason: 'deleted',
            message: 'Bad username or password'
        });
      }
        
    } else {
      console.log("[AUTH] Signin failure");
      reply.code(200).send({
          success: false,
          reason: 'unknown',
          message: 'Bad username or password'
      });
    }
    

  }).catch(function (err) {
    console.log("[AUTH] Signin failure: " + err.message);
    reply.code(200).send({
        success: false,
        message: err.message
    });
  });

}

function resetPassword (req, reply)
{
  if (!req.body.username) {
      reply.code(200).send({
        success: false,
        message: 'username required'
      });
  } else {
    queries.getUserByEmail(req.body.username).then((data) => {

      if (data.length > 0) {
        if (AccessUtil.isActive(data[0].status)) {
        // create reset token for that user
        let reset_token = crypto.randomBytes(20).toString('hex');

        queries.setResetToken(data[0].id, reset_token).then(() => {
            // Ok, now send mail to user with the token

            // console.log(req.headers.host);

            mailer.sendMail(
              data[0].email,
              'TarotClub - Nouveau mot de passe',
              'Vous recevez cet email parque que vous avez demandé une ré-initialisation de votre mot de passe sur le site tarotclub.fr.\n\n' +
              'Merci de copier-coller le lien suivant dans votre navigateur pour continuer le processus :\n\n' + req.headers.host +
              '/newpassword/' + reset_token + '\n\n' +
              "Si vous n'êtes pas à l'origine de cette action, ignorez simplement cet email, votre mot de passe restera inchangé.\n"
            ).then( () => {

              reply.code(200).send({
                  success: true,
                  message: 'email sent'
              });

            }).catch((error, info) => {
              
              reply.code(200).send({
                  success: false,
                  message: error
              });

            });

        }).catch((err) => {
          console.log("[AUTH] set reset token failure: " + err.message);
          reply.code(200).send({
              success: false,
              message: err.message
          });
        });

      } else {
        reply.code(200).send({
            success: false,
            message: 'Account not validated'
        });
      }
        
    } else {
      reply.code(200).send({
          success: false,
          message: 'Unknown mail address'
      });
    }
      

    }).catch(function (err) {
      console.log("[AUTH] get email failure: " + err.message);
      reply.code(200).send({
          success: false,
          message: err.message
      });
    });
    
  }

}

function setNewPassword (req, reply)
{
  console.log("[AUTH] Set new password called");

  if ((req.body.honeypot === '') && (req.body.human === true)) {

    queries.getUserByResetToken(req.body.token).then( function (data) {

        if (data.length > 0) {

          let timeout = new Date(data[0].reset_password_datetime);
          let now = new Date();
          if (AccessUtil.isActive(data[0].status) && (timeout > now)) {

            queries.setNewPassword(data[0].id, saltPassword(req.body.password)).then(function () {
                
              reply.code(200).send({
                  success: true,
                  message: 'Password changed'
              });

          }).catch(function (err) {
            console.log("[AUTH] set reset token failure: " + err.message);
            reply.code(200).send({
                success: false,
                message: err.message
            });
          });

        } else {
          reply.code(200).send({
              success: false,
              message: 'Account not validated or timeout'
          });
        }
          
      } else {
        reply.code(200).send({
            success: false,
            message: 'Unknown mail address'
        });
      }
      

    }).catch(function (err) {
      console.log("[AUTH] get email failure: " + err.message);
      reply.code(200).send({
          success: false,
          message: err.message
      });
    });

  } else {
    console.log("[AUTH] Detected bot attempt");
  }
}


module.exports = async function (fastify) {

  fastify.post('/newpassword', setNewPassword);
  fastify.post('/resetpassword', resetPassword);
  fastify.post('/signin', signIn);
  fastify.post('/signup', signUp);
}

