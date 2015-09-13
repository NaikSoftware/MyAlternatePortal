/**
 * Created by SecretLabs on 13.09.15.
 */

function API() {

    var self = this;

    var path = '/get-schedule';

    self.getFaculties = function () {
        return $.get(path + '/faculties/all');
    };

    self.getCourses = function (facultyId) {
        return $.get(path + '/courses/' + facultyId);
    };

    self.getGroups = function (facultyAndCourse) {
        return $.get(path + '/groups/' + facultyAndCourse);
    };
}

var api = new API();