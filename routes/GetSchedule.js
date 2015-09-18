/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');
var moment = require('moment');

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
            models.Course.find({
                facultyId: models.db.Types.ObjectId(req.params.parent)
            }).lean().exec(function (err, result) {
                if (checkResult(err, result)) {
                    result.forEach(function (course) {
                        course._id = self.packVars(req.params.parent, course._id);
                    });
                    res.send(result);
                } else res.status(404).end();
            });

        } else if (type === 'groups') {
            var params = self.parseVars(req.params.parent, 2);
            if (!params) res.status(400).end();
            else {
                models.Group.find({
                    facultyId: models.db.Types.ObjectId(params[0]),
                    courseId: models.db.Types.ObjectId(params[1])
                }).lean().exec(function (err, result) {
                    if (checkResult(err, result)) res.send(result);
                    else res.status(404).end();
                });
            }

        } else if (type === 'schedule') {
            var startOfWeek = moment().startOf('week').add(1, 'day');
            var endOfWeek = startOfWeek.clone().add(6, 'days');
            models.Schedule.find({
                groupId: models.db.Types.ObjectId(req.params.parent),
                startTime: {'$gte': startOfWeek, '$lt': endOfWeek}
            }).lean().exec(function (err, result) {
                if (checkResult(err, result)) {
                    res.send(result[0]);
                } else res.status(404).end();
            });

        } else {
            res.status(404).end();
        }
    });

    function checkResult(err, result) {
        return !err && result && result.length > 0;
    }

};
