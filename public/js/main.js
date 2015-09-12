$(function () {

    /* Initialize */

    $('#btn_login').click(login);

    $('#btn_logout').click(logout);

    $('#btn_admin_panel').click(function () {
        window.location.href = 'admin';
    });

    function login() {
        var pass = $('#pass').val();
        API.jsonQuery('/login', {name: 'Admin', password: pass})
            .done(function () {
                window.location.href = 'admin';
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

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });

});


