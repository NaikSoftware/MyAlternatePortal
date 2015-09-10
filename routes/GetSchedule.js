/**
 * Created by SecretLabs on 10.09.15.
 */

var Route = require('./route');

module.exports = function GetSchedule() {
    var self = this;

    Route.extend(GetSchedule);
    Route.call(this, 'GET', '/get-schedule');

    self.addHandler(function (req, res) {
        console.dir(req);
    });

};