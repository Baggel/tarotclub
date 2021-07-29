const router = require('express').Router();
const queries = require('../../sql/queries.js');

router.post('/profile', (req, res) => {

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
                res.status(200).json({
                    success: true,
                    message: "Profile updated"
                });

            }).catch(function (err) {
                console.log("[USER] Profile is not updated: " + err.message);
                res.status(200).json({
                    success: false,
                    message: err.message
                });
            });

        } else {
            console.log("[USER] Get username failure");
            res.status(200).json({
                success: false,
                message: 'Cannot update user'
            });
        }
    }).catch(function (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    });
});

router.get('/profile', (req, res) => {

    queries.getUserByUsername(req.jwt.user.username
    ).then(function (data) {

        if (data.length > 0) {
            res.status(200).json({
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
            res.status(200).json({
                success: false,
                message: 'No user'
            });
        }

    }).catch(function (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    });
});


module.exports = router;