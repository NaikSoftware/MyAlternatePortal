/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');
var multer = require('multer');
var converter = require('../converter');

module.exports = function SaveSchedule(models) {
    var self = this;

    Route.extend(SaveSchedule);
    Route.call(this, 'POST', '/save-schedule');

    self.setup = function (app) {
        app.use(multer().single('schedule-file'));
    };

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        if (typeof req.session.logined == 'undefined') {
            res.status(403).end();
            return;
        }

        try {
            var weeks = converter(req.file);
            console.log(JSON.stringify(weeks, null, 4));
            res.send('{}');
        } catch(e) {
            console.log(e);
            res.status(422).send(e.message);
        }
    });

    function checkResult(err, result) {
        return !err && result && result.length > 0;
    }

};
