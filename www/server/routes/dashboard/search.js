const router = require('express').Router();
const queries = require('../../sql/queries.js');

router.get('/search', (req, res) => {
    
    queries.search(req.body.search).then(function() {
        res.status(200).json({
            success: true,
            message: "Search done",
        });

    }).catch(function (err) {
        console.log("[SEARCH] Error: " + err.message);
        res.status(200).json({
            success: false,
            message: err.message
        });
    });
});   

module.exports = router;