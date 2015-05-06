var express = require('express');
var router = express.Router();
var OSS = require('oss-client');

var oss = OSS.create({
    accessKeyId: 'aNgmvBucXXcJnOgj',
    accessKeySecret: 'GBJN7GarVWrITZT9YZR64Ir6bOLEM5'
});

/* GET home page. */
router.get('/', function (req, res, next) {

    var options = {
        root:'../oss-client-ui/app/'
    };
    var fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
});

router.all('/api', function (req, res, next) {
    oss.listBucket(function (err, data) {
        console.log(JSON.stringify(data));
        res.json(data);
    });
});



module.exports = router;
