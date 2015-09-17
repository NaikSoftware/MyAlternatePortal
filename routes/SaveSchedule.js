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

        if (!checkQuery(req.body)) {
            res.status(400).end();
            return;
        }

        var faculty, course, group;
        if (req.body.faculty.type === 'new') {
            faculty = new models.Faculty({name: req.body.faculty.val});
            faculty.save();
        }
        if (req.body.course.type === 'new' && faculty) {
            course = new models.Course({
                name: req.body.course.val,
                facultyId: faculty.id
            });
            course.save();
        }
        if (req.body.group.type === 'new' && course) {
            group = new models.Group({
                name: req.body.group.val,
                facultyId: faculty.id,
                courseId: course.id
            });
            group.save();
            convert(group);
        } else {
            models.Group.findById(req.body.group.val, function (err, gr) {
                convert(gr);
            });
        }
    });

    function convert(group) {
        try {
            var weeks = converter(req.file);
            weeks.forEach(function (week) {
                //week.groupId =
                //new models.Schedule(week).save();
            });
            res.send('{}');
        } catch (e) {
            console.log(e);
            res.status(422).send(e.message);
        }
    }

    function checkResult(err, result) {
        return !err && result && result.length > 0;
    }

    function checkQuery(body) {
        return req.file
            && checkVar(body.faculty)
            && checkVar(body.course)
            && checkVar(body.group);
    }

    function checkVar(v) {
        return v && v.val;
    }

};
