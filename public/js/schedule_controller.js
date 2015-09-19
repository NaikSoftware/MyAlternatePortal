/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var scheduleAdapter = new ScheduleAdapter();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    var waiting = $('#waiting');
    var content = $('#content');
    showWarn('Schedule not selected');

    scheduleAdapter.lists(facultyList, coursesList, groupsList)
        .providers(api.getFaculties, api.getCourses, api.getGroups)
        .done(loadSchedule);

    function loadSchedule(scheduleId) {
        waiting.css({'opacity': 1, 'z-index': 1000});
        $.get('get-schedule/schedule/' + scheduleId)
            .done(showSchedule)
            .fail(function (err) {
                showWarn(err.responseCode + ' ' + err.responseText);
            }).always(function () {
                waiting.css({'opacity': 0, 'z-index': -1})
            });
    }

    function showSchedule(data) {
        content.empty();
        var week = $('\
            <div class="panel panel-primary">\
                <div class="panel-heading text-center">\
                    <a href="#" class="label label-primary pull-left" onclick="goPrev()">\
                        <span class="large-size glyphicon glyphicon-arrow-left"></span>\
                    </a>\
                    <span class="medium-size" id="head"></span>\
                    <a href="#" class="label label-primary pull-right" onclick="goNext()">\
                        <span class="large-size glyphicon glyphicon-arrow-right"></span>\
                    </a>\
                </div>\
                <div class="panel-body"><div class="container flex-container"></div></div>\
            </div>');

        week.find('#head').text('Week ' + moment(data.startTime).format('DD.MM.YYYY'));
        var panel = week.find('.flex-container');
        data.days.forEach(function (day) {
            panel.append(renderDay(day));
        });
        content.append(week);
    }

    function renderDay(data) {
        var container = $('<div>').addClass('panel panel-info');
        container.append($('<div>').addClass('panel-heading').text(data.name + ' ' + date(data.date)));
        var table = $('<table>').addClass('table table-hover');
        table.append($('<col>').addClass('lesson_number'));
        table.append($('<col>').addClass('lesson_text'));

        data.lectures.forEach(function (lecture) {
            if (lecture.text === '') return;
            table.append(renderLecture(lecture));
        });
        container.append(table);
        return $('<div>').addClass('flex-item').append(container);
    }

    function renderLecture(data) {
        return $('<tr>')
            .append($('<td>').text(data.number))
            .append($('<td>').text(data.text)
                .append('<br>')
                .append($('<span>').addClass('lesson-time')
                    .append(lectSchedule[data.number])));
    }

    function date(raw) {
        return moment(raw).format('DD.MM.YYYY');
    }

    var lectSchedule = {
        1: '7.30-8.50',
        2: '9.00-10.20',
        3: '10.30-11.50',
        4: '12.05-13.25',
        5: '13.35-14.55',
        6: '15.05-16.25',
        7: '16.35-17.55',
        8: '18.05-19.25'
    };

    function showWarn(text) {
        content.empty();
        var msg = $('<div>' + text.toLocaleString() + '</div>')
            .addClass('label label-primary main-message');
        content.append(msg);
    }

});
