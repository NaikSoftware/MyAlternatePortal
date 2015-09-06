/**
 * Created by SecretLabs on 06.09.15.
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

module.exports = function (server) {

    function Auth(server) {
        server.app.use(session({
            secret: 'secret_labs',
            store: new MongoStore({mongooseConnection: server.mongo})
        }));
    }

    function check(name, pass) {

    }

    return Auth(server);
};

function strToHash(str) {
    return crypto.createHash().update(pass).digest('hex');
}
