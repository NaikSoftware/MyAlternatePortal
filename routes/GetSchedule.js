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
    var Faculty = mongoConn.model('faculties', facultySchema);

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        console.dir(req.params);
        if (req.params.type === 'faculties') {
            Faculty.find({}, function (err, result) {
                if (!err && result) res.send(result);
                else res.sendStatus(404);
            });
        } else {
            res.sendStatus(404);
        }
    });

};