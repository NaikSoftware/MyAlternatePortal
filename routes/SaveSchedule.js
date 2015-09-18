/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');
var multer = require('multer');
var converter = require('../converter');
//var Busboy = require('busboy');


module.exports = function SaveSchedule(models) {
    var self = this;

    Route.extend(SaveSchedule);
    Route.call(this, 'POST', '/save-schedule');

    self.setup = function (app) {
        var dir = process.env.OPENSHIFT_DATA_DIR || 'uploads/';
        console.log('Using upload dir: ', dir);
        var upload = multer({dest: dir});
        self.addHandler(upload.single('schedule-file'));
        self.addHandler(handleRequest);
    };

    function handleRequest(req, res) {
        res.setHeader('Content-Type', 'application/json');

        /*var busboy = new Busboy({headers: req.headers});
         busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
         console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
         file.on('data', function (data) {
         console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
         });
         file.on('end', function () {
         console.log('File [' + fieldname + '] Finished');
         });
         });
         busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
         console.log('Field [' + fieldname + ']: value: ' + val);
         });
         busboy.on('finish', function () {
         console.log('Done parsing form!');
         });
         req.pipe(busboy);*/


        if (typeof req.session.logined == 'undefined') {
            res.status(403).send('Permissions denied');
            return;
        }

        var faculty, course, group;
        try {
            console.log(req.body);
            console.log(req.file);
            faculty = checkVar(req.body.faculty);
            course = checkVar(req.body.course);
            group = checkVar(req.body.group);
        } catch (error) {
            console.error(error.stack);
            res.status(400).send('Query parameters wrong: ' + error.message);
            return;
        }

        var facultyDB, courseDB, groupDB;
        try {
            saveFaculty();
            res.send('{}');
        } catch (e) {
            console.log(e);
            res.status(422).send(e.message);
        }

        function saveFaculty() {
            if (faculty.type === 'new') {
                facultyDB = new models.Faculty({name: faculty.val});
                facultyDB.save(function () {
                    saveCourse();
                });
            } else {
                models.Faculty.findById(faculty.val, function (err, fac) {
                    facultyDB = fac;
                    saveCourse();
                });
            }
        }

        function saveCourse() {
            if (course.type === 'new' && facultyDB) {
                courseDB = new models.Course({
                    name: course.val,
                    facultyId: facultyDB.id
                });
                courseDB.save(function () {
                    saveGroup();
                });
            } else {
                var values = self.parseVars(course.val, 2); // 0 - faculty id, 1 - course id
                if (!values) throw new Error('Course param broken');
                models.Course.findById(values[1], function (err, cou) {
                    courseDB = cou;
                    saveGroup();
                });
            }
        }

        function saveGroup() {
            if (group.type === 'new' && courseDB) {
                groupDB = new models.Group({
                    name: group.val,
                    facultyId: facultyDB.id,
                    courseId: courseDB.id
                });
                groupDB.save(function () {
                    convert();
                });
            } else {
                models.Group.findById(group.val, function (err, gr) {
                    groupDB = gr;
                    convert();
                });
            }
        }

        function convert() {
            var weeks = converter(req.file);
            if (!weeks) return;
            weeks.forEach(function (week) {
                week.groupId = groupDB.id;
                new models.Schedule(week).save();
            });
        }

        function checkVar(v) {
            v = JSON.parse(v);
            if (typeof v == 'undefined' || typeof v.val == 'undefined')
                throw new Error('Var ' + v + ' has wrong format or undefined');
            return v;
        }

    }

};
