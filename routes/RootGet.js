/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function RootGet() {
    var self = this;

    Route.extend(RootGet);
    Route.call(this, 'GET', '*');

    self.addHandler(function (req, res, next) {
        res.setHeader('Content-Type', 'text/html');
        res.locals.data = { logined: req.session.logined };
        next();
    });

};
