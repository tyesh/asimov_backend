var express = require('express');
let router = express.Router();
const loginModule = require('../src/modules/loginModule');
const uvmModule = require("../src/modules/uvmModule");
const CREATE_PROVIDER_ROUTE = "/test-create-supplier";

router.post(CREATE_PROVIDER_ROUTE, function(req, res){
    try {
        loginModule.doLogin(req.body.user.trim(), req.body.password.trim(), req.body.env.trim())
        .then(loginRes => {
            if(loginRes.success) {
                uvmModule.createArticleSupplier(res, req.body.env.trim())
            } else {
                res.json(loginRes);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;