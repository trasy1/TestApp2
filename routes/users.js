var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')

/*
 * GET userlist.
 */
router.get('/reportlist', function(req, res) {
    var db = req.db;
    db.collection('reportlist').find().toArray(function (err, items) {
        res.json(items);
    });

});

/*
 * POST to adduser.
 */
router.post('/addreport', function(req, res) {
    var db = req.db;


    db.collection('reportlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }

        );

    });
});


module.exports = router;