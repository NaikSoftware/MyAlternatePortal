/**
 * Created by SecretLabs on 09.09.15.
 */

var Route = require('./route');

module.exports = function AdminPanel() {

    AdminPanel.prototype = Object.create(Route.prototype);
    Route.apply(this, 'GET', '/admin');

    addHandler(function (req, res) {
        res.sendStatus(500);
    });

};