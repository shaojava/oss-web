var express = require('express');
var router = express.Router();
var _ = require('underscore');

var OSSSigner = require('../node_modules/aliyun-sdk/lib/signers/oss.js');
var request = require('request');
require('request-debug')(request);

var credentials = {
    accessKeyId: "aNgmvBucXXcJnOgj",
    secretAccessKey: "GBJN7GarVWrITZT9YZR64Ir6bOLEM5"
};

/* GET home page. */
router.get('/', function (req, res, next) {
    var options = {
        root: '../oss-client-ui/app/'
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
    if (req.headers['x-proxy-host']) {
        req.headers['host'] = req.headers['x-proxy-host'];
        var requestUrl = 'http://' + req.headers['x-proxy-host'] + req.url.replace(/^\/api/, '');
        var requestOSS = request({
            url: requestUrl,
            method: req.method,
            headers: req.headers,
            body: req.rawBody
        });
        requestOSS.virtualHostedBucket = req.headers['x-proxy-bucket'] ? req.headers['x-proxy-bucket'] : '';
        var signer = new OSSSigner(requestOSS);
        signer.addAuthorization(credentials, new Date());
        requestOSS.pipe(res);
    } else {
        res.send(404);
    }
});

module.exports = router;
