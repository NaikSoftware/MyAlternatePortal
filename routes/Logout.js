/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function Logout() {
    var self = this;

    Route.extend(Logout);
    Route.call(this, 'GET', '/logout');

    self.addHandler(function (req, res) {
        delete req.session.logined;
        res.redirect('/');
    });

};