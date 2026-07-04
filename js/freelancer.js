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

// Toggle the yeardreamschool6th posting sidebar
$(function() {
    function syncYeardreamSidebarHeight(context) {
        var $scope = context ? $(context) : $(document);

        $scope.find('.yeardream-modal').each(function() {
            var $modal = $(this);
            var $sidebar = $modal.find('.yeardream-sidebar');
            var $image = $modal.find('.yeardream-main img');

            if (!$sidebar.length || !$image.length) {
                return;
            }

            if ($(window).width() < 768) {
                $sidebar.css('height', '');
                return;
            }

            var imageHeight = $image.outerHeight();
            if (imageHeight > 0) {
                $sidebar.css('height', imageHeight + 'px');
            }
        });
    }

    $('.yeardream-sidebar-toggle').on('click', function() {
        var $button = $(this);
        var $sidebar = $button.closest('.yeardream-sidebar');
        var isCollapsed = $sidebar.toggleClass('is-collapsed').hasClass('is-collapsed');

        $button.attr('aria-expanded', !isCollapsed);
        $button.find('.sr-only').text(isCollapsed ? '메뉴 펼치기' : '메뉴 접기');
    });

    $('.portfolio-modal').on('shown.bs.modal', function() {
        syncYeardreamSidebarHeight(this);
    });

    $('.yeardream-main img').on('load', function() {
        syncYeardreamSidebarHeight($(this).closest('.portfolio-modal'));
    });

    $(window).on('resize.yeardreamSidebar', function() {
        syncYeardreamSidebarHeight($('.portfolio-modal.in'));
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
