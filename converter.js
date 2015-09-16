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

    var offsetY = 0, offsetX = 1, startOffsetY = 0;
    while (true) {
        var cell = sheet['A' + (++startOffsetY)];
        if (!cell) continue;
        if (cell.t === 'n') { // find first row with lecture number (cell type 'n')
            startOffsetY -= 2; // back to row with beginning of the week
            break;
        }
        if (startOffsetY > MAX_OFFSET_Y) return null;
    }

    var week, counter = 0;
    while (week = readWeek()) {
        if (counter++ > MAX_WEEKS) throw  new Error('Weeks limit exceeded');
        //console.log('Week readed');
        weeks.push(week);
        offsetX++;
    }

    function readWeek() {
        offsetY = startOffsetY;
        //console.log('Read week: ', toAddr(offsetX, offsetY));
        if (!sheet[toAddr(offsetX, offsetY)]) return null;
        var week = {days: [], startTime: convertTime(offsetX, offsetY)};

        var day, counter = 0;
        while (day = readDay()) {
            if (counter++ > MAX_DAYS) throw  new Error('Days limit exceeded');
            //console.log('Day readed');
            week.days.push(day);
        }
        return week;
    }

    function readDay() {
        //console.log('Read day: ', toAddr(offsetX, offsetY));
        if (!sheet[toAddr(offsetX, offsetY)]) return null;
        var day = {lectures: [], date: convertTime(offsetX, offsetY), name: dayName(0, offsetY)};
        offsetY++;

        var lecture, counter = 0;
        while (lecture = readLecture(offsetX, offsetY)) {
            if (counter++ > MAX_LECTURES) throw new Error('Lectures limit exceeded');
            //console.log(lecture);
            day.lectures.push(lecture);
            offsetY++;
        }
        if (day.lectures.length < 1) return null; // skip empty days
        return day;
    }

    function readLecture() {
        //console.log('Read lecture: ', toAddr(offsetX, offsetY));
        var number = sheet['A' + (offsetY + 1)];
        if (!number || number.t !== 'n') return null;
        var text = readCell(offsetX, offsetY);
        if (!text) text = {v: ''};
        return {number: number.v, text: text.v};
    }

    function readCell(c, r) {
        var addr = toAddr(c, r);
        if (sheet[addr]) return sheet[addr];
        //console.log('Detected merge or null');
        for (var i = 0; i < merges.length; i++) {
            var merge = merges[i];
            if (merge.s.r <= r && merge.e.r >= r && merge.s.c <= c && merge.e.c >= c) { // in range
                return sheet[toAddr(merge.s.c, merge.s.r)];
            }
        }
        //console.log('Cell not detected');
    }

    function convertTime(c, r) {
        //console.log('Read time: ', toAddr(c, r));
        var cell = sheet[toAddr(c, r)];
        if (!cell) throw new Error('Cell [' + toAddr(c, r) + '] has no Date');

        var arr = cell.v.split('.');
        return new Date('20' + arr[2], arr[1], arr[0]);
    }

    function dayName(c, r) {
        var cell = sheet[toAddr(c, r)];
        if (!cell) throw Error('Cell [' + toAddr(c, r) + '] has no Day name');
        return cell.v;
    }

    function toAddr(c, r) {
        return String.fromCharCode(97 + c).toUpperCase() + (r + 1);
    }

    return weeks;
};
