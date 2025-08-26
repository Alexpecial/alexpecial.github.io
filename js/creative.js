/*!
 * Start Bootstrap - Creative Bootstrap Theme[](http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

    // New code for photo.html: Initialize Masonry and handle photo clicks
    if ($('.photo-grid').length) {
        // Wait for images to load before initializing Masonry
        $('.photo-grid').imagesLoaded(function() {
            $('.photo-grid').masonry({
                itemSelector: '.photo-item',
                columnWidth: '.photo-item',
                percentPosition: true,
                gutter: 10
            });
        });

        // Photo click event to open modal
        $('.photo-item').on('click', function() {
            var src = $(this).data('src');
            var caption = $(this).data('caption');
            $('#photoModal .modal-img').attr('src', src);
            $('#photoModal .modal-caption').text(caption);
            $('#photoModal').modal('show');
        });
    }

})(jQuery); // End of use strict