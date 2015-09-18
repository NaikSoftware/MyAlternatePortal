/**
 * Created by SecretLabs on 11.09.15.
 */

$(function () {

    var waiting = $('#waiting');
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
        list.getResult = function () {
            var newName = input.val().trim();
            var selected = list.find('.active')[0];
            if (newName !== '')  return JSON.stringify({val: newName, type: 'new'});
            else if (selected === undefined) return null;
            else return JSON.stringify({val: selected.id});
        }
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
        //e.preventDefault();

        var data = getFormData();
        if (!data) return;

        waiting.css({'opacity': 1, 'z-index': 1000});
        var xhr = $.ajax({
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
        }).always(function () {
            waiting.css({'opacity': 0, 'z-index': -1})
        });
    });

    function getFormData() {
        var formData = new FormData();

        if (file) formData.append('schedule-file', file);
        else return notSelected('File');

        var selected = facultyList.getResult();
        if (selected) formData.append('faculty', selected);
        else return notSelected(facultyList);

        selected = coursesList.getResult();
        if (selected) formData.append('course', selected);
        else return notSelected(coursesList);

        selected = groupsList.getResult();
        if (selected) formData.append('group', selected);
        else return notSelected(groupsList);

        return formData;
    }

    function notSelected(obj) {
        var name = (typeof obj == 'string') ? obj : obj.data('name');
        alert(name + ' not selected');
        return false;
    }

});