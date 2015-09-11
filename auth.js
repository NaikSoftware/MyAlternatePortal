/**
 * Created by SecretLabs on 06.09.15.
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

module.exports = function Auth(mongoose, application) {

    application.app.use(session({
        secret: 'secret_labs',
        store: new MongoStore({mongooseConnection: application.mongoConn})
    }));

    var mongoConn = application.mongoConn;
    var Schema = mongoose.Schema;

    var userSchema = new Schema({name: String, password: String});
    var User = mongoConn.model('users', userSchema);

    Auth.prototype.check = function (login, pass, handler) {
        User.findOne({name: 'Admin', password: strToHash(pass)}, function (err, result) {
            handler(!err && result);
        });
    };
};

function strToHash(str) {
    try {
        return crypto.createHash('md5').update(str).digest('hex');
    } catch (e) {
        return null;
    }
}
