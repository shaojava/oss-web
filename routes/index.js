var express = require('express');
var router = express.Router();
var _ = require('underscore');

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
    console.log('req.headers', req.headers);
    //res.send();
    if (req.headers['x-proxy-host']) {
        var target = 'http://' + req.headers['x-proxy-host'];
        req.headers['host'] = req.headers['x-proxy-host'];
        //require('request').debug = true;
        console.log('req.path', req);
        if (req.method == 'GET') {
            console.log('url', target + req.url.replace(/^\/api/,''));
            var requestOSS = request({
                url: target + req.url.replace(/^\/api/,''),
                method: req.method,
                //qs: req.query,
                headers: req.headers
            });
            var signer = new OSSSigner(requestOSS);
            signer.addAuthorization(credentials, new Date());
            console.log('requestOSS', requestOSS.headers['Authorization']);
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
            console.log('requestOSS', requestOSS.headers['Authorization']);
            requestOSS.pipe(res);
        }
        //var req2 = _.clone(req);
        //req2.headers['host'] = ;
        //if (req2.method == 'GET') {
        //    var requestOSS2 = request({
        //        url: target,
        //        method: req2.method,
        //        qs: req2.query,
        //        headers: req2.headers
        //    });
        //    var signer = new OSSSigner(requestOSS2);
        //    signer.addAuthorization(credentials, new Date());
        //    console.log('requestOSS2', requestOSS2.headers['Authorization']);
        //}
    }

});

module.exports = router;
