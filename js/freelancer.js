/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    var $page = $('html, body');
    var cancelScrollEvents = 'wheel.navScroll mousewheel.navScroll DOMMouseScroll.navScroll touchstart.navScroll keydown.navScroll';

    $('.page-scroll a').on('click', function(event) {
        var target = $(this).attr('href');
        if (!target || target.charAt(0) !== '#' || !$(target).length) {
            return;
        }

        $(document).off(cancelScrollEvents).one(cancelScrollEvents, function() {
            $page.stop(true);
        });

        $page.stop(true).animate({
            scrollTop: $(target).offset().top
        }, 600, 'swing', function() {
            $(document).off(cancelScrollEvents);
        });
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
