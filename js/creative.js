/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function ($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function (event) {
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
    $('.navbar-collapse ul li a').click(function () {
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

})(jQuery); // End of use strict

// Language Toggle Functionality
$(document).ready(function () {
    $('#lang-toggle').click(function () {
        if ($('body').hasClass('lang-ko')) {
            $('body').removeClass('lang-ko').addClass('lang-en');
            $(this).text('한국어');  // 영어 모드로 전환 시 버튼 텍스트 변경
        } else {
            $('body').removeClass('lang-en').addClass('lang-ko');
            $(this).text('English');  // 한글 모드로 전환 시 버튼 텍스트 변경
        }
    });
});