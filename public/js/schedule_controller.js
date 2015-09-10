/**
 * Created by SecretLabs on 10.09.15.
 */

$(function () {

    var api = new API();

    var facultyList = $('#faculties-list');
    var coursesList = $('#courses-list');
    var groupsList = $('#groups-list');

    $('#faculties-button').click(function () {
        if (empty(facultyList)) {
            api.fillFaculties(facultyList);
        }
    });

    $('#courses-button').click(function () {
        if (empty(facultyList)) {
            coursesList.empty();
            coursesList.append(genWarning('Факультет'));
        } else if (empty(coursesList)) {
            api.fillCourses(coursesList);
        }
    });

    $('#groups-button').click(function () {
        if (empty(coursesList)) {
            groupsList.empty();
            groupsList.append(genWarning('Курс'));
        } else if (empty(groupsList)) {
            api.fillGroups(groupsList);
        }
    });

    function genWarning(text) {
        var ic = $('<span>').addClass('glyphicon glyphicon-hand-left');
        var text = $('<i class="text-info">' + text + '</i>');
        return $('<li>').addClass('drop-item').append(ic, ' Сначала выберите ', text);
    }

    function empty(list) {
        return list.attr('aria-disabled');
    }

});