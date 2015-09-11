/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var api = new API();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    var content = $('#content');
    showVoidWarn();

    api.delegateControl(facultyList, coursesList, groupsList, function (scheduleId) {
        console.log('Selected ' + scheduleId);
    });

    function showVoidWarn() {
        content.empty();
        var msg = $('<div>Schedule not selected</div>')
            .css('font-size', '40px')
            .addClass('label label-primary');
        content.append(msg);
    }

});