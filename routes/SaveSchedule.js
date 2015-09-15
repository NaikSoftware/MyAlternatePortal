/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');
var schemas = require('../models');

module.exports = function SaveSchedule(models) {
    var self = this;

    Route.extend(SaveSchedule);
    Route.call(this, 'POST', '/save-schedule');

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        if (typeof req.session.logined == 'undefined') {
            res.status(403).end();
            return;
        }

        var data = req.body.data;

        console.dir(req.file);
        res.send('{}');

    });

    function checkResult(err, result) {
        return !err && result && result.length > 0;
    }

};