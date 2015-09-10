/**
 * Created by SecretLabs on 10.09.15.
 */

var API = function () {

    var self = this;
    self.path = '/get-schedule';

    self.getFaculties = function () {

    };

};

API.jsonQuery = function (path, obj) {
    return $.ajax({
        url: path,
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    });
};