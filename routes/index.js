var express = require('express');
var router = express.Router();
//var httpProxy = require('http-proxy');
var OSSSigner = require('../node_modules/aliyun-sdk/lib/signers/oss.js');
var request = require('request');
require('request-debug')(request);

//var tunnel = require('tunnel');

//var tunnelingAgent = tunnel.httpOverHttp({
//    proxy: {
//        host: 'localhost',
//        port: 8888
//    }
//});

var credentials = {
    secretAccessKey: "GBJN7GarVWrITZT9YZR64Ir6bOLEM5",
    accessKeyId: "aNgmvBucXXcJnOgj"
};
//var proxy = httpProxy.createProxyServer({
//    //agent:tunnelingAgent
//});

//proxy.on('proxyReq', function (proxyReq, req, res, options) {
//    var signer = new OSSSigner(req);
//    signer.addAuthorization(credentials, new Date());
//    console.log('res', res.body);
//});


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
    //var target = 'http://' + "" + (req.query['region'] ? req.query['region'] + '.' : '') + req.query['host'];
    console.log('target', target);
    //require('request').debug = true;
    //req.headers['host'] = target.replace('http://', '');
    if (req.method == 'GET') {
        var requestOSS = request({
            url: target,
            method: req.method,
            qs: req.query,
            headers: req.headers
        });
        //delete(req.headers);
        var signer = new OSSSigner(requestOSS);
        signer.addAuthorization(credentials, new Date());
        requestOSS.pipe(res);
    } else {
        console.log('req.body', req.rawBody);
        var requestOSS = request({
            url: target,
            method: req.method,
            body: req.rawBody,
            //qs: req.query,
            headers: req.headers
        });
        var signer = new OSSSigner(requestOSS);
        signer.addAuthorization(credentials, new Date());
        requestOSS.pipe(res);
    }
});


module.exports = router;
