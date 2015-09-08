/**
 * Created by SecretLabs on 06.09.15.
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

module.exports = function Auth(server) {
    console.log('Auth module');

    server.app.use(session({
        secret: 'secret_labs',
        store: new MongoStore({mongooseConnection: server.mongo})
    }));

    this.mongo = server.mongo;

    Auth.prototype.check = function (login, pass) {
        return false;
    };
};

function strToHash(str) {
    return crypto.createHash().update(pass).digest('hex');
}
