/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');

module.exports = function RemoveSchedule(models) {
    var self = this;

    Route.extend(RemoveSchedule);
    Route.call(this, 'GET', '/remove/:type/:id');

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');

        if (typeof req.session.logined == 'undefined') {
            res.status(403).send('Permissions denied');
            return;
        }

        var type = req.params.type;
        if (type === 'faculty') removeFaculty(req.params.id);
        else if (type === 'course') {
            var params = self.unpackVars(req.params.id, 2);
            if (params) removeCourse(params[1]);
        } else if (type === 'group') removeGroup(req.params.id);

        res.send({});

        function removeFaculty(id) {
            removeCourses(id);
            models.Faculty.remove({_id: models.db.Types.ObjectId(id)}, function (err, r) {
                console.log('Faculty removed', r.result);
            });
        }

        function removeCourse(id) {
            removeGroups(id);
            models.Course.remove({_id: models.db.Types.ObjectId(id)}, function (err, r) {
                console.log('Course removed', r.result);
            });
        }

        function removeGroup(id) {
            removeSchedule(id);
            models.Group.remove({_id: models.db.Types.ObjectId(id)}, function (err, r) {
                console.log('Group removed', r.result);
            });
        }

        function removeSchedule(groupId) {
            models.Schedule.remove({groupId: models.db.Types.ObjectId(groupId)}, function (err, r) {
                console.log('Schedule removed', r.result);
            });
        }

        function removeCourses(facultyId) {
            models.Course.find({facultyId: models.db.Types.ObjectId(facultyId)})
                .lean().exec(function (err, data) {
                    if (!checkResult(err, data)) return;
                    data.forEach(function (course) {
                        removeCourse(course._id);
                    });
                });
        }

        function removeGroups(courseId) {
            models.Group.find({courseId: models.db.Types.ObjectId(courseId)})
                .lean().exec(function (err, data) {
                    if (!checkResult(err, data)) return;
                    data.forEach(function (group) {
                        removeGroup(group._id);
                    });
                });
        }

        function checkResult(err, result) {
            return !err && result && result.length > 0;
        }
    });

};
