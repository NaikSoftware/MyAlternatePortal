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
        // Heading
        content.empty();
        var week = $('<div>').addClass('panel panel-primary')
            .append($('<div>').addClass('panel-heading')
                .append($('<h4>').text('Week ' + date(data.startTime) )));
        var panel = $('<div>').addClass('container flex-container');
        week.append($('<div>').addClass('panel-body').append(panel));

        data.days.forEach(function (day) {
            panel.append(renderDay(day));
        });
        content.append(week);
    }

    function renderDay(data) {
        var container = $('<div>').addClass('panel panel-info');
        container.append($('<div>').addClass('panel-heading').text(data.name + ' ' + date(data.date)));
        var table = $('<table>').addClass('table table-hover');

        container.append(table);
        return $('<div>').addClass('flex-item').append(container);
    }

    function date(raw) {
        return moment(raw).format('DD.MM.YYYY');
    }

    function showWarn(text) {
        content.empty();
        var msg = $('<div>' + text.toLocaleString() + '</div>')
            .addClass('label label-primary main-message');
        content.append(msg);
    }

});
