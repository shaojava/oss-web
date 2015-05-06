var express = require('express');
var router = express.Router();
var httpProxy = require('http-proxy');

var accessKeyId = "aNgmvBucXXcJnOgj";
var secretAccessKey = "GBJN7GarVWrITZT9YZR64Ir6bOLEM5";

var proxy = httpProxy.createProxyServer({});


proxy.on('proxyReq', function (proxyReq, req, res, options) {
    //console.log('req',req);
});


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
    console.log('req', req.query);
    proxy.web(req, res, {
        target: 'http://' + (req.query['bucket'] ? req.query['bucket'] + "." : "") + (req.query['region'] ? req.query['region'] + '.' : '') + req.query['host']
    });
});


module.exports = router;
