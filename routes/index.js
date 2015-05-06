var express = require('express');
var router = express.Router();
var ALY = require('aliyun-sdk');

var oss = new ALY.OSS({
    "accessKeyId": "aNgmvBucXXcJnOgj",
    "secretAccessKey": "GBJN7GarVWrITZT9YZR64Ir6bOLEM5",
    // 根据你的 oss 实例所在地区选择填入
    // 杭州：http://oss-cn-hangzhou.aliyuncs.com
    // 北京：http://oss-cn-beijing.aliyuncs.com
    // 青岛：http://oss-cn-qingdao.aliyuncs.com
    // 深圳：http://oss-cn-shenzhen.aliyuncs.com
    // 香港：http://oss-cn-hongkong.aliyuncs.com
    // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
    // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
    // 北京：http://oss-cn-beijing-internal.aliyuncs.com
    // 青岛：http://oss-cn-qingdao-internal.aliyuncs.com
    // 深圳：http://oss-cn-shenzhen-internal.aliyuncs.com
    // 香港：http://oss-cn-hongkong-internal.aliyuncs.com
    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '2013-10-15'
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
    oss.listBuckets(function (err, data) {
        //if (err) {
        //    console.log('error:', err);
        //    return;
        //}
        console.log(JSON.stringify(data));
        res.json(data);
    });
});



module.exports = router;
