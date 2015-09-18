/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var scheduleAdapter = new ScheduleAdapter();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    var content = $('#content');
    showWarn('Schedule not selected');

    scheduleAdapter.lists(facultyList, coursesList, groupsList)
        .providers(api.getFaculties, api.getCourses, api.getGroups)
        .done(function (scheduleId) {
            $.get('get-schedule/schedule/' + scheduleId)
                .done(showSchedule)
                .fail(showWarn);
        });

    function showSchedule(data) {
        content.empty();
        console.log(data);
    }

    function showWarn(text) {
        content.empty();
        var msg = $('<div>' + text.toLocaleString() + '</div>')
            .addClass('label label-primary main-message');
        content.append(msg);
    }

});