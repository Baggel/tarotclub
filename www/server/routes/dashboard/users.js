const router = require('express').Router();
const queries = require('../../sql/queries.js');
const AccessUtil = require("../accessutil.js");

router.post('/profile', (req, res) => {

    queries.getUserByUsername(req.body.username
        ).then(function (data) {
        if (data.length > 0) {
            let canModify = true;
            let currentLevel = data[0].level;
            let newLevel = req.body.level;

            if (AccessUtil.isAdmin(currentLevel) && !AccessUtil.isAdmin(newLevel)) {
                canModify = false;
            }


             // Protection: can't lower admin rights
            if (canModify) {

                queries.updateProfile(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.company,
                    req.body.email,
                    req.body.tel,
                    req.body.level,
                    req.body.username
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


            }  else {
                console.log("[USER] Cannot update user");
                res.status(200).json({
                    success: false,
                    message: 'Cannot update user'
                });
            }

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


router.post('/delete', (req, res) => {

    queries.getUserByUsername(req.body.username
        ).then(function (data) {
        // Protection: can't delete admin
        if (data.length > 0) {
            if (data[0].level < 100) {

                queries.deleteUser(req.body.username).then(function() {
                    res.status(200).json({
                        success: true,
                        message: "User deleted"
                    });

                }).catch(function (err) {
                    console.log("[USER] User is not deleted: " + err.message);
                    res.status(200).json({
                        success: false,
                        message: err.message
                    });
                });
            }  else {
                console.log("[USER] Cannot delete user");
                res.status(200).json({
                    success: false,
                    message: 'Cannot delete user'
                });
            }

        } else {
            console.log("[USER] Get username failure");
            res.status(200).json({
                success: false,
                message: 'Cannot delete user'
            });
        }
    }).catch(function (err) {
        res.status(200).json({
            success: false,
            message: err.message
        });
    });
});

router.get('/users', (req, res) => {
    
    queries.getUsers(req.jwt.user.id
    ).then(function (data) {

        if (data.length > 0) {
            console.log(data);
            res.status(200).json({
                success: true,
                data: {
                    users: data
                },
                message: "Get all users"
            })
        } else {
            console.log("[USER] Get users failure");
            res.status(200).json({
                success: false,
                message: 'No users found'
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