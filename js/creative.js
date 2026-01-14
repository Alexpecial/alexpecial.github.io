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

/* =========================================
 * Language Toggle Script (Korean Default)
 * ========================================= */
(function ($) {
    "use strict";

    // 1. 기본 언어 설정 (localStorage에 없으면 'ko'를 기본값으로)
    var currentLang = localStorage.getItem('site-lang') || 'ko';

    // 2. 언어 적용 함수
    function applyLanguage(lang) {
        if (lang === 'ko') {
            $('.lang-en').hide();
            $('.lang-ko').fadeIn(200); // 부드러운 전환
            $('#lang-label').text('English'); // 버튼 텍스트는 반대 언어로
        } else {
            $('.lang-ko').hide();
            $('.lang-en').fadeIn(200);
            $('#lang-label').text('한국어');
        }
        localStorage.setItem('site-lang', lang);
        currentLang = lang;
    }

    // 3. 초기 실행
    $(document).ready(function () {
        applyLanguage(currentLang);
    });

    // 4. 버튼 클릭 이벤트
    $('#language-toggle').click(function (e) {
        e.preventDefault();
        var newLang = (currentLang === 'ko') ? 'en' : 'ko';
        applyLanguage(newLang);
    });

})(jQuery);