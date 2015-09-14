/**
 * Created by SecretLabs on 11.09.15.
 */

$(function () {

    var scheduleAdapter = new ScheduleAdapter();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    var newFaculty = $('#new-faculty');
    var newCourse = $('#new-course');
    var newGroup = $('#new-group');

    scheduleAdapter.lists(facultyList, coursesList, groupsList)
        .providers(api.getFaculties, api.getCourses, api.getGroups);

    trigger(facultyList, newFaculty);
    trigger(coursesList, newCourse);
    trigger(groupsList, newGroup);

    function trigger(list, input) {
        list.data('input', input);
        input.keyup(function () {
            if (list.data('prev') && list.data('prev').data('btn').hasClass('disabled')) return;
            setDisabledNext(list, input.val() !== '');
        });
    }

    function setDisabledNext(list, disabled) {
        if (!list) return;

        if (list.data('input').val() !== '' || disabled) list.data('btn').addClass('disabled');
        else list.data('btn').removeClass('disabled');
        setDisabledNext(list.data('next'), disabled);
    }

    var form = $('form');
    var file = $(':file');

    form.on('submit', function (e) {
        e.preventDefault();
    });

    file.change(function () {
        var file = this.files[0];

    });

});