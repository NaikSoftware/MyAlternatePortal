/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function Index() {
    var self = this;

    Route.extend(Index);
    Route.call(this, 'GET', '/');

    self.addHandler(function (req, res) {
        res.locals.data.schedule = true;
        res.send(self.getTemplate('index.html')(res.locals.data));
    });

};
