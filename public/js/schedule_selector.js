/**
 * Created by SecretLabs on 10.09.15.
 */

var ScheduleSelector = function () {

    var self = this;
    var path = '/get-schedule';

    self.delegateControl = function (facultiesList, coursesList, groupsList) {

        var menu = $('.schedule-menu');
        var dropdowns = menu.find('.dropdown');
        menu.delegate('a', 'click', function () {
            return false;                                 // prevent default behavior
        }).find('.dropdown').delegate('a', 'click', function () {
            dropdowns.removeClass('open');                // close all
            $(this).parent('.dropdown').addClass('open'); // open selected
        });

        initList(facultiesList, null, 'Факультет', '/faculties/');
        initList(coursesList, facultiesList, 'Курс', '/courses/');
        initList(groupsList, coursesList, 'Группа', '/groups/');
        return self;
    };

    self.done = function (callback) {
        self.callback = callback;
    };

    function fill(list, parentId) {
        if (filled(list)) return;
        list.empty();
        list.append(createDropItem('glyphicon-hourglass', 'Загрузка'));
        $.get(path + list.data('query') + parentId).done(function (data) {
            render(list, data);
            list.parents('.dropdown').on('click', 'li', function () {
                var li = $(this);
                list.data('btn').text(li.children().first().text())
                    .append($('<span>').addClass('caret'));

                var next = list.data('next');
                var selected = li.attr('id');
                if (!next && self.callback) {
                    self.callback(selected); // schedule selected
                } else if (next) {
                    resetNextLists(next);
                    next.parent().addClass('open');
                    next.data('parentId', selected);
                    fill(next, selected);   // or else show next list
                }
            })
        }).fail(function (err) {
            cancelFill(list, err);
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
        return $('<li>').addClass('drop-item').append($('<a>').append(ic, ' ', string).attr('href', '#'));
    }

    function cancelFill(list, err) {
        if (err.status === 404) {
            list.empty().append(createDropItem('glyphicon-alert', 'Ничего нет'));
        } else {
            alert('Getting information error: ' + err.responseText);
        }
    }

    function initList(list, prev, name, query) {
        var btn = list.parents('.dropdown').find('.btn');
        list.data('name', name)
            .data('btn', btn)
            .data('query', query);
        btn.click(function () {
            if (prev && !filled(prev) || prev && !list.data('parentId')) { // list not ready for filling
                showWarning(list, prev);
            } else fill(list, list.data('parentId'));
        });
        if (prev) prev.data('next', list);
    }

    function showWarning(list, prev) {
        list.empty().append($('<li>').addClass('drop-item')
            .append($('<span>').addClass('glyphicon glyphicon-hand-up'))
            .append(' Сначала выберите ').append($('<i class="text-info">' + prev.data('name') + '</i>')));
    }

    function filled(list) {
        return list.attr('aria-disabled') === 'false';
    }

    function resetNextLists(next) {
        if (!next) return;
        next.data('btn').text(next.data('name')).append($('<span>').addClass('caret'));
        next.parents('.dropdown').off('click', 'li');
        next.data('parentId', null);
        next.attr('aria-disabled', 'true');
        resetNextLists(next.data('next'));
    }

};