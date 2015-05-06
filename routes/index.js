var express = require('express');

var router = express.Router();
var httpProxy = require('http-proxy');
var OSSSigner = require('../node_modules/aliyun-sdk/lib/signers/oss.js');
var request = require('request');


var credentials = {
    secretAccessKey:"GBJN7GarVWrITZT9YZR64Ir6bOLEM5",
    accessKeyId:"aNgmvBucXXcJnOgj"
};
var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    var  signer = new OSSSigner(req);
    signer.addAuthorization(credentials,  new Date());
    proxyReq.setHeader('Authorization', req['headers']['Authorization']);
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
    var target = 'http://' + (req.query['bucket'] ? req.query['bucket'] + "." : "") + (req.query['region'] ? req.query['region'] + '.' : '') + req.query['host'];
    console.log('target',target);

    proxy.web(req, res, {
        target: target
    });
});


module.exports = router;
