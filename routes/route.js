/**
 * Created by SecretLabs on 09.09.15.
 */

module.exports = function Route(method, path) {
    this.path = path;
    this.method = method;
    this.handlers = [];

    Route.prototype.addHandler = function (handler) {
        this.handlers.push(handler);
    }
};
