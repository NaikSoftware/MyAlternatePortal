/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function AdminPanel() {
    var self = this;

    Route.extend(AdminPanel);
    Route.call(this, 'GET', '/admin');

    self.addHandler(function (req, res) {
        if (typeof req.session.logined != 'undefined') {
            res.send(self.getTemplate('admin_panel.html')(res.locals.data));
        } else {
            res.sendStatus(403);
        }
    });

};