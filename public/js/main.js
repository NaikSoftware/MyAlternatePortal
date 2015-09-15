$(function () {

    /* Initialize */

    $('#btn_login').click(login);

    $('#btn_logout').click(logout);

    $('#btn_admin_panel').click(function () {
        window.location.href = 'admin';
    });

    function login() {
        var pass = $('#pass').val();
        Helper.jsonQuery('/login', {name: 'Admin', password: pass})
            .done(function () {
                window.location.href = '/admin';
            }).fail(showLoginError);
    }

    function showLoginError(err) {
        $('#myAlert').addClass('in');
        setTimeout(function () {
            $('#myAlert').removeClass('in');
        }, 1000);
    }

    function logout() {
        window.location.href = '/logout';
    }

    /* Setup file selecting fields */
    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

        var ext = label.substring(label.indexOf('.'));
        var exts = $(this).attr('datatype').split('/\s+/g');
        if (exts && exts.length > 0) {
            if ($.inArray(ext, exts) === -1) {
                alert('File type ' + ext + ' not supported');
                return;
            }
        }

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });

});

/* Helper */
var Helper = {
    jsonQuery: function (path, obj) {
        return $.ajax({
            url: path,
            type: 'POST',
            data: JSON.stringify(obj),
            contentType: 'application/json; charset=utf-8',
            processData: false,   // tell jQuery not to process the data
            //contentType: false,   // tell jQuery not to set contentType
            dataType: 'json'
        });
    }
};


