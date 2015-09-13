/**
 * Created by SecretLabs on 10.09.15.
 */

var ScheduleAdapter = function () {

    var self = this;

    /**
     * Params - JQuery wrapped tags UL. Must be wrapped to .dropdown Bootstrap classes
     */
    self.lists = function (facultiesList, coursesList, groupsList) {
        self.facultiesList = facultiesList;
        self.coursesList = coursesList;
        self.groupsList = groupsList;

        var menu = $('.schedule-menu');
        var dropdowns = menu.find('.dropdown');
        menu.delegate('a', 'click', function () {
            return false;                                 // prevent default behavior
        }).find('.dropdown').delegate('a', 'click', function () {
            dropdowns.removeClass('open');                // close all
            $(this).parent('.dropdown').addClass('open'); // open selected
        });

        initList(facultiesList, null, 'Факультет');
        initList(coursesList, facultiesList, 'Курс');
        initList(groupsList, coursesList, 'Группа');
        return self;
    };

    /**
     * Params - function with parameter "parentId". Must return object with functions
     * .done(data) and .fail(error)
     */
    self.providers = function (faculties, courses, groups) {
        self.facultiesList.provider = faculties;
        self.coursesList.provider = courses;
        self.groupsList.provider = groups;
        return self;
    };

    /**
     * Called when schedule was selected
     */
    self.done = function (callback) {
        self.callback = callback;
    };

    function fill(list, parentId) {
        if (filled(list)) return;
        list.empty();
        list.append(createDropItem('glyphicon-hourglass', 'Загрузка'));
        list.provider(parentId).done(function (data) {
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

    function initList(list, prev, name) {
        var btn = list.parents('.dropdown').find('.btn');
        list.data('name', name)
            .data('btn', btn)
            .data('prev', prev);
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