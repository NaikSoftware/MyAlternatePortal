/**
 * Created by SecretLabs on 10.09.15.
 */

var API = function () {

    var self = this;
    self.path = '/get-schedule';

    self.fillFaculties = function (list) {
        self.fill('/faculties/null', list);
    };

    self.fillCourses = function (list, facultyId) {
        self.fill('/courses/' + facultyId, list);
    };

    self.fillGroups = function (list, courseId) {
        self.fill('groups/' + courseId, list);
    };

    self.fill = function (query, list) {
        list.empty();
        list.append(self.createDropItem('glyphicon-hourglass', 'Загрузка'));
        $.get(self.path + query).done(function (data) {
            self.render(list, data);
        }).fail(function (err) {
            self.cancelFill(list, err)
        });
    };

    self.createDropItem = function (icon, string) {
        var ic = $('<span>').addClass('glyphicon ' + icon);
        return $('<li>').addClass('drop-item').append(ic, string);
    };

    self.render = function (list, data) {
        list.empty();
    };

    self.cancelFill = function (list, err) {
        list.empty();
        alert('Data loading error, please, contact with administration: ' + err);
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