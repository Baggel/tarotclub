const queries = require('../../sql/queries.js');
const jwtUtil = require("../jwtutil.js");

function setProfile (req, reply)
{
    queries.getUserByUsername(req.jwt.user.username
        ).then(function (data) {
        if (data.length > 0) {

            queries.updateMyProfile(
                req.body.firstname,
                req.body.lastname,
                req.body.company,
                req.body.email,
                req.body.tel,
                req.jwt.user.username
            ).then(function() {
                reply.code(200).send({
                    success: true,
                    message: "Profile updated"
                });

            }).catch(function (err) {
                console.log("[USER] Profile is not updated: " + err.message);
                reply.code(200).send({
                    success: false,
                    message: err.message
                });
            });

        } else {
            console.log("[USER] Get username failure");
            reply.code(200).send({
                success: false,
                message: 'Cannot update user'
            });
        }
    }).catch(function (err) {
        reply.code(200).send({
            success: false,
            message: err.message
        });
    });
}

function getProfile (req, reply)
{
    queries.getUserByUsername(req.jwt.user.username
    ).then(function (data) {
        if (data.length > 0) {
            reply.code(200).send({
                success: true,
                data: {
                    profile: {
                        id: data[0].id,
                        username: data[0].username,
                        firstname: data[0].firstname,
                        lastname: data[0].lastname,
                        email: data[0].email,
                        company: data[0].company,
                        tel: data[0].tel,
                        level: data[0].level
                    }
                },
                message: "Get user profile"
            })
        } else {
            console.log("[USER] Get profile failure");
            reply.code(200).send({
                success: false,
                message: 'No user'
            });
        }

    }).catch(function (err) {
        reply.code(200).send({
            success: false,
            message: err.message
        });
    });
}

module.exports = async function (fastify) {

    fastify.get('/profile', { preHandler: jwtUtil.checkTokenAllUsers }, getProfile);
    fastify.post('/profile', { preHandler: jwtUtil.checkTokenAllUsers }, setProfile);
}
