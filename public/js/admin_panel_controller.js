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
    var file;
    $(':file').change(function () {
        file = this.files[0];
    });

    form.on('submit', function (e) {
        e.preventDefault();

        var data = getFormData();
        if (!data) return;

        $.ajax({
            url: '/save-schedule',
            type: 'POST',
            data: data,
            enctype: 'multipart/form-data',
            processData: false,   // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function (res) {
            alert('Upload complete!');
            window.location.href = '/admin';
        }).fail(function (err) {
            alert('Upload error: ' + err.responseText);
        });
    });

    function getFormData() {
        var formData = new FormData();

        if (file) formData.append('schedule-file', file);
        else return warning('File not selected');

        return formData;
    }

    function warning(text) {
        alert(text);
        return false;
    }

});