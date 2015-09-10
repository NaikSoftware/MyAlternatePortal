/**
 * Created by SecretLabs on 10.09.15.
 */

var API = function () {

    var self = this;
    self.path = '/get-schedule';

    self.fillFaculties = function (list) {
        self.prepare(list);
    };

    self.fillCourses = function (list, facultyId) {
        self.prepare(list);
    };

    self.fillGroups = function (list, courseId) {
        self.prepare(list);
    };

    self.createDropItem = function (icon, string) {
        var ic = $('<span>').addClass('glyphicon ' + icon);
        return $('<li>').addClass('drop-item').append(ic, string);
    };

    self.prepare = function (list) {
        list.empty();
        list.append(self.createDropItem('glyphicon-hourglass', 'Загрузка'));
    };

    self.render = function(list, data) {
        list.empty();
    }

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