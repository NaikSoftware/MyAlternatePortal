/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');

module.exports = function GetSchedule(mongoose, mongoConn) {
    var self = this;

    Route.extend(GetSchedule);
    Route.call(this, 'GET', '/get-schedule/:type/:parent');

    var Schema = mongoose.Schema;

    var facultySchema = new Schema({name: String});
    var groupSchema = new Schema({name: String, facultyId: String, course: Number});

    var Faculty = mongoConn.model('faculties', facultySchema);
    var Group = mongoConn.model('groups', groupSchema);

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.dir(req.params);
        var type = req.params.type;
        if (type === 'faculties') {
            Faculty.find({}, function (err, result) {
                if (!err && result) res.send(result);
                else res.sendStatus(404);
            });
        } else if (type === 'courses') {
            res.send([
                {_id: req.params.parent + '&1', name: '1 курс'},
                {_id: req.params.parent + '&2', name: '2 курс'},
                {_id: req.params.parent + '&3', name: '3 курс'},
                {_id: req.params.parent + '&4', name: '4 курс'}
            ]);
        } else if (type === 'groups') {
            var params = req.params.parent.split('&');
            if (params.length !== 2) res.sendStatus(400);
            else {
                Group.find({facultyId: params[0], course: params[1]}, function (err, result) {
                    if (!err && result.length > 0) res.send(result);
                    else res.sendStatus(404);
                });
            }
        } else {
            res.sendStatus(404);
        }
    });

};