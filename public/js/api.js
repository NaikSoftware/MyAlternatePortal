/**
 * Created by SecretLabs on 10.09.15.
 */

var API = function () {

    var self = this;
    var path = '/get-schedule';

    self.delegateControl = function (facultiesList, coursesList, groupsList) {
        initList(facultiesList, null, 'Факультет', '/faculties/');
        initList(coursesList, facultiesList, 'Курс', '/courses/');
        initList(groupsList, coursesList, 'Группа', '/groups/');
        facultiesList.data('btn').click(function () {
            fill(facultiesList);
        });
    };

    function fill(list, parentId) {
        if (filled(list)) return;
        list.empty();
        list.append(createDropItem('glyphicon-hourglass', 'Загрузка'));
        $.get(path + list.data('query') + parentId).done(function (data) {
            render(list, data);
            list.parents('.dropdown').delegate('li', 'click', function () {
                var li = $(this);
                list.data('btn').text(li.children().first().text())
                    .append($('<span>').addClass('caret'));
            });
        }).fail(function (err) {
            cancelFill(list, err)
        });
    }

    function render(list, data) {
        list.empty();
        list.attr('aria-disabled', false);
        data.forEach(function (elem) {
            list.append(createDropItem('', elem.name).attr('id', elem._id));
        });
    }

    function createDropItem(icon, string) {
        var ic = $('<span>').addClass('glyphicon ' + icon);
        return $('<li>').addClass('drop-item').append($('<a>').append(ic, string).attr('href', '#'));
    }

    function cancelFill(list, err) {
        alert('Data loading error, please, contact with administration: ' + err.responseText);
    }

    function initList(list, prev, text, query) {
        var btn = list.parents('.dropdown').find('.btn');
        list.data('name', text)
            .data('btn', btn)
            .data('query', query);
        btn.click(function () {
            if (prev && !filled(prev)) {
                list.empty();
                list.append(genWarning(prev.data('name')));
            }
        });
    }

    function genWarning(text) {
        var ic = $('<span>').addClass('glyphicon glyphicon-hand-left');
        var text = $('<i class="text-info">' + text + '</i>');
        return $('<li>').addClass('drop-item').append(ic, ' Сначала выберите ', text);
    }

    function filled(list) {
        return list.attr('aria-disabled') === 'false';
    }

};

API.jsonQuery = function (path, obj) {
    return $.ajax({
        url: path,
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    });
};