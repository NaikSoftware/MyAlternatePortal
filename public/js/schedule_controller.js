/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var api = new API();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    $('#faculties-button').click(function () {
        if (facultyList.children().length === 0) {
            api.fillFaculties(facultyList);
        }
    });

    $('#courses-button').click(function () {
        if (facultyList.children().length === 0) {
            return;
        }
        if (coursesList.children().length === 0) {
            api.fillCourses(coursesList);
        }
    });

    $('#groups-button').click(function () {
        if (coursesList.children().length === 0) {
            return;
        }
        if (groupsList.children().length === 0) {
            api.fillGroups(groupsList);
        }
    });

});