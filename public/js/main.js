$(function () {

    /* Initialize */

    $('#btn_login').click(function () {
            var pass = $('#pass').val();
            if (validatePassword(pass)) {
                $('#loginModal').modal('hide');
                login(pass);
            } else {
                $('#myAlert').addClass('in');
                setTimeout(function () {
                    $('#myAlert').removeClass('in');
                }, 1000);
            }
        }
    );

    function validatePassword(pass) {
        return pass && pass.length > 5 && pass.length < 100;
    }

    function login(pass) {

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
            body.css('padding-top', '100px');
        }
    }

});


