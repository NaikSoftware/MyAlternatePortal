$(function () {

    /* Initialize */

    $('#btn_login').click(function () {
        var pass = $('#pass').val();
        login(pass);
    });

    $('#btn_logout').click(function () {
        logout();
    });

    $('#btn_admin_panel').click(function () {
        window.location.href = 'admin';
    });

    function login(pass) {
        var data = {name: 'Admin', password: pass};
        API.jsonQuery('/login', data)
            .done(function (res) {
                window.location.href = 'admin';
            })
            .error(showLoginError);
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


    /* Adjust screen size */
    var navbar = $('#navbar');
    var body = $('body');

    $(window).resize(adjustScreenSize($(window).width()));

    function adjustScreenSize(width) {
        if (width < 800) {
            navbar.removeClass('navbar-fixed-top');
            body.css('padding-top', '0px');
        } else {
            navbar.addClass('navbar-fixed-top');
            body.css('padding-top', '70px');
        }
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

        console.log(input, log);

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });

});


