/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var api = new API();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    api.delegateControl(facultyList, coursesList, groupsList);

});