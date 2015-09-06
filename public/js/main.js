$(function () {

    /* Initialize */

    $('#btn_login').click(function () {
        var pass = $('#pass').val();
        login(pass);
    });

    $('#btn_logout').click(function () {
        var pass = $('#pass').val();
        logout();
    });

    function login(pass, next) {
        var data = {name: 'Admin', password: pass};
        $.ajax({
            url: '/login',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        })
            .done(function (res) {
                if (res.ok) window.location.href = 'admin';
                else showLoginError();
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
        window.location.href = '/';
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

});


