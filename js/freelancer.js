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

            if ($sidebar.hasClass('is-collapsed')) {
                $sidebar.css({
                    height: '',
                    maxHeight: ''
                });
                return;
            }

            if ($(window).width() < 768) {
                $sidebar.css({
                    height: '',
                    maxHeight: ''
                });
                return;
            }

            var imageHeight = $image[0].getBoundingClientRect().height;
            if (imageHeight > 0) {
                var sidebarHeight = Math.floor(imageHeight);
                $sidebar.css({
                    height: sidebarHeight + 'px',
                    maxHeight: sidebarHeight + 'px'
                });
            }
        });
    }

    function scheduleYeardreamSidebarSync(context) {
        syncYeardreamSidebarHeight(context);

        if (window.requestAnimationFrame) {
            requestAnimationFrame(function() {
                syncYeardreamSidebarHeight(context);
                requestAnimationFrame(function() {
                    syncYeardreamSidebarHeight(context);
                });
            });
        }

        setTimeout(function() {
            syncYeardreamSidebarHeight(context);
        }, 100);

        setTimeout(function() {
            syncYeardreamSidebarHeight(context);
        }, 300);
    }

    $('.yeardream-sidebar-toggle').on('click', function() {
        var $button = $(this);
        var $sidebar = $button.closest('.yeardream-sidebar');
        var isCollapsed = $sidebar.toggleClass('is-collapsed').hasClass('is-collapsed');

        $button.attr('aria-expanded', !isCollapsed);
        $button.find('.sr-only').text(isCollapsed ? '메뉴 펼치기' : '메뉴 접기');

        if (isCollapsed) {
            $sidebar.css({
                height: '',
                maxHeight: ''
            });
        } else {
            scheduleYeardreamSidebarSync($button.closest('.portfolio-modal'));
        }
    });

    $(document).on('click', '.yeardream-menu-link', function(event) {
        event.preventDefault();

        var $link = $(this);
        var $modal = $link.closest('.yeardream-modal');
        var $main = $modal.find('.yeardream-main');
        var $panel = $main.find('.yeardream-content-panel');
        var title = $link.attr('data-title') || $.trim($link.text());
        var week = $link.attr('data-week') || '커리큘럼';
        var path = week === '커리큘럼' ? title : week + ' / ' + title;
        var summary = $link.attr('data-summary') || '선택한 항목: ' + path;

        $modal.find('.yeardream-menu-link')
            .removeClass('is-active')
            .removeAttr('aria-current');

        $link
            .addClass('is-active')
            .attr('aria-current', 'page');

        $panel.find('.yeardream-content-week').text(week);
        $panel.find('.yeardream-content-title').text(title);
        $panel.find('.yeardream-content-summary').text(summary);
        $panel
            .removeAttr('hidden')
            .addClass('is-active')
            .attr('aria-hidden', 'false');
        $main.addClass('is-showing-content');

        scheduleYeardreamSidebarSync($link.closest('.portfolio-modal'));
    });

    $('.portfolio-modal').on('shown.bs.modal', function() {
        scheduleYeardreamSidebarSync(this);
    });

    $('.yeardream-main img').on('load', function() {
        scheduleYeardreamSidebarSync($(this).closest('.portfolio-modal'));
    });

    $(window).on('resize.yeardreamSidebar', function() {
        scheduleYeardreamSidebarSync($('.portfolio-modal.in'));
    });

    if (window.ResizeObserver) {
        $('.yeardream-main img').each(function() {
            var image = this;
            var observer = new ResizeObserver(function() {
                scheduleYeardreamSidebarSync($(image).closest('.portfolio-modal'));
            });
            observer.observe(image);
        });
    }
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
