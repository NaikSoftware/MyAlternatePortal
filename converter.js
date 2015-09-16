/**
 * Created by SecretLabs on 16.09.15.
 */

var XLSX = require('xlsx');

module.exports = function (file) {
    if (!file) return null;

    var book = XLSX.read(file.buffer);
    var sheet = book.Sheets[book.SheetNames[0]];
    var merges = sheet['!merges'];

    var weeks = [];

    var offsetY = 0, offsetX = 1;
    for (var i = 0; i < 100; i++) {
        var cell = sheet['A' + i];
        if (!cell) continue;
        if (sheet['A' + i].t === 'n') { // find first row with lecture number (cell type 'n')
            offsetY = i - 1;
            break;
        }
    }
    var week;
    while (week = readWeek(offsetX, offsetY)) {
        weeks.push(week);
        offsetX++;
    }

    function readWeek(offsetX, offsetY) {
        console.log('Read week: ', offsetX, offsetY);
    }

    function readDay(offsetX, offsetY) {

    }

    function cell(r, c) {
        var addr = toAddr(r, c);
        if (sheet[addr]) return sheet[addr];
        for (var i = 0; i < merges.length; i++) {
            var merge = merges[i];
            if (merge.s.r <= r && merge.e.r >= r && merge.s.c <= c && merge.e.c >= c) { // in range
                return sheet[toAddr(merge.s.r, merge.s.c)];
            }
        }
    }

    return weeks;
};

function toAddr(r, c) {
    return String.fromCharCode(97 + c).toUpperCase() + (r + 1);
}
