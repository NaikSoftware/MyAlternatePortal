/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');
var schemas = require('../models');

module.exports = function GetSchedule(models) {
    var self = this;

    Route.extend(GetSchedule);
    Route.call(this, 'GET', '/get-schedule/:type/:parent');

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var type = req.params.type;

        if (type === 'faculties') {
            models.Faculty.find({}, function (err, result) {
                if (checkResult(err, result)) res.send(result);
                else res.status(404).end();
            });

        } else if (type === 'courses') {
            models.Course.find({facultyId: req.params.parent}).lean().exec(function (err, result) {
                if (checkResult(err, result)) {
                    result.forEach(function (course) {
                        course._id = req.params.parent + '&' + course._id;
                    });
                    res.send(result);
                } else res.status(404).end();
            });

        } else if (type === 'groups') {
            var params = req.params.parent.split('&');
            if (params.length !== 2) res.status(400).end();
            else {
                models.Group.find({facultyId: params[0], courseId: params[1]}, function (err, result) {
                    if (checkResult(err, result)) res.send(result);
                    else res.status(404).end();
                });
            }

        } else {
            res.status(404).end();
        }
    });

    function checkResult(err, result) {
        return !err && result && result.length > 0;
    }

};