/**
 * Created by SecretLabs on 11.09.15.
 */

$(function () {

    var scheduleSelector = new ScheduleSelector();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    scheduleSelector.delegateControl(facultyList, coursesList, groupsList);

});