/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function Login(auth) {
    var self = this;

    Route.extend(Login);
    Route.call(self, 'POST', '/login');

    self.addHandler(function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        auth.check(req.body.name, req.body.password, function (result) {
            if (result) {
                req.session.logined = true;
                res.send('{}');
            } else {
                res.status(403).end();
            }
        });
    });

};