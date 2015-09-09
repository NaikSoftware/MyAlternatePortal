/**
 * Created by SecretLabs on 09.09.15.
 */

var fs = require('fs');
var ejs = require('ejs');

module.exports = function Route(method, path) {
    var self = this;

    self.path = path;
    self.method = method;
    self.handlers = [];

    self.templDir = './templates/';
    self.cache = [];

    self.addHandler = function (handler) {
        self.handlers.push(handler);
    };

    self.getTemplate = function (path) {
        var templ = self.cache[path];
        if (templ) {
            return templ;
        } else {
            templ = ejs.compile(fs.readFileSync(self.templDir + path, 'utf-8'), {filename: self.templDir + path});
            self.cache[path] = templ;
            return templ;
        }
    };

};

module.exports.extend = function (Child) {
    Child.prototype = Object.create(module.exports.prototype);
    Child.prototype.constructor = Child;
};
