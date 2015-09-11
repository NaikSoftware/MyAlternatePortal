/**
 * Created by SecretLabs on 11.09.15.
 */

$(function () {

    var api = new API();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    $('.main').css('align-items', 'flex-start');

    api.delegateControl(facultyList, coursesList, groupsList);

});