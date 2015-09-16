/**
 * Created by SecretLabs on 16.09.15.
 */

var XLSX = require('xlsx');

const MAX_OFFSET_Y = 30;
const MAX_WEEKS = 30;
const MAX_DAYS = 7;
const MAX_LECTURES = 8;

module.exports = function (file) {
    if (!file) return null;

    var book = XLSX.read(file.buffer);
    var sheet = book.Sheets[book.SheetNames[0]];
    var merges = sheet['!merges'];

    var weeks = [];

    var offsetY = 0, offsetX = 1;
    while (true) {
        var cell = sheet['A' + (++offsetY)];
        if (!cell) continue;
        if (cell.t === 'n') { // find first row with lecture number (cell type 'n')
            offsetY--; // back to row with beginning of the week
            break;
        }
        if (offsetY > MAX_OFFSET_Y) return null;
    }

    var week, counter = 0;
    while (week = readWeek(++offsetX, offsetY)) {
        if (counter++ > MAX_WEEKS) throw  new Error('Weeks limit exceeded');
        weeks.push(week);
    }

    function readWeek(offsetX, offsetY) {
        console.log('Read week: ', offsetX, offsetY);
        var week = {days: [], startTime: convertTime(offsetY, offsetX)};

        var day, counter = 0;
        while (day = readDay(offsetX, offsetY)) {
            if (counter++ > MAX_DAYS) throw  new Error('Days limit exceeded');
            week.days.push(day);
        }
    }

    function readDay(offsetX, offsetY) {
        console.log('Read day: ', offsetX, offsetY);
        if (!sheet[toAddr(offsetY, offsetX)]) return null;
        var day = {lectures: [], date: convertTime(offsetX, offsetY)};
        offsetY++;

        var lecture, counter = 0;
        while (lecture = readLecture(offsetX, offsetY)) {
            console.log(lecture);
            if (counter++ > MAX_LECTURES) throw  new Error('Lectures limit exceeded');
            day.lectures.push(lecture);
        }
    }

    function readLecture(offsetX, offsetY) {
        console.log('Read lecture: ', offsetX, offsetY);
        var number = sheet['A' + (++offsetY)];
        if (number.t !== 'n') return null;
        var text = readCell(offsetY, offsetX);
        if (!text || !text.t === 's') return null;
        return {number: number.v, text: text.v};
    }

    function readCell(r, c) {
        var addr = toAddr(r, c);
        if (sheet[addr]) return sheet[addr];
        for (var i = 0; i < merges.length; i++) {
            var merge = merges[i];
            if (merge.s.r <= r && merge.e.r >= r && merge.s.c <= c && merge.e.c >= c) { // in range
                return sheet[toAddr(merge.s.r, merge.s.c)];
            }
        }
    }

    function convertTime(r, c) {
        console.log('Read time: ', r, c);
        var cell = sheet[toAddr(r, c)];
        if (!cell) throw new Error('Cell [' + r + ', ' + c + '] has no Date');

        var arr = cell.v.split('.');
        return new Date('20' + arr[2], arr[1], arr[0]);
    }

    return weeks;
};

function toAddr(r, c) {
    return String.fromCharCode(97 + c).toUpperCase() + (r + 1);
}
