/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	$(function () {

		var $window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$footer = $('#footer'),
			$main = $('#main'),
			$main_articles = $main.children('article');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Fix: Flexbox min-height bug on IE.
		if (skel.vars.IEVersion < 12) {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function () {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function () {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

		// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with even number of items.
		if ($nav_li.length % 2 == 0) {

			$nav.addClass('use-middle');
			$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

		}

		// Events.

		// Show article.
		$main._show = function (id, initial) {

			var $article = $main_articles.filter('#' + id);

			// No such article? Bail.
			if ($article.length == 0)
				return;

			// Handle lock.

			// Already locked? Speed through "show" steps w/o delays.
			if ($main._locked || (typeof initial != 'undefined' && initial === true)) {

				// Mark as switching.
				$body.addClass('is-switching');

				// Mark as visible.
				$body.addClass('is-article-visible');

				// Deactivate all articles (just in case one's already active).
				$main_articles.removeClass('active');

				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				$article.addClass('active');

				// Unlock.
				$main._locked = false;

				// Unmark as switching.
				$body.removeClass('is-switching');

				// Window stuff.
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				return;

			}

			// Lock.
			$main._locked = true;

			// Article already visible? Just swap articles.
			if ($body.hasClass('is-article-visible')) {

				// Deactivate current article.
				var $currentArticle = $main_articles.filter('.active');

				$currentArticle.removeClass('active');

				// Show article.
				setTimeout(function () {

					// Hide current article.
					$currentArticle.hide();

					// Show article.
					$article.show();

					// Activate article.
					setTimeout(function () {

						$article.addClass('active');

						// Window stuff.
						$window
							.scrollTop(0)
							.triggerHandler('resize.flexbox-fix');

						// Unlock.
						setTimeout(function () {
							$main._locked = false;
						}, 325);

					}, 25);

				}, 325);

			}

			// Otherwise, handle as normal.
			else {

				// Mark as visible.
				$body
					.addClass('is-article-visible');

				// Show article.
				setTimeout(function () {

					// Hide header, footer.
					$header.hide();
					$footer.hide();

					// Show main, article.
					$main.show();
					$article.show();

					// Activate article.
					setTimeout(function () {

						$article.addClass('active');

						// Window stuff.
						$window
							.scrollTop(0)
							.triggerHandler('resize.flexbox-fix');

						// Unlock.
						setTimeout(function () {
							$main._locked = false;
						}, 325);

					}, 25);

				}, 325);

			}

		};

		// Hide article.
		$main._hide = function (addState) {

			var $article = $main_articles.filter('.active');

			// Article not visible? Bail.
			if (!$body.hasClass('is-article-visible'))
				return;

			// Add state?
			if (typeof addState != 'undefined'
				&& addState === true)
				history.pushState(null, null, '#');

			// Handle lock.

			// Already locked? Speed through "hide" steps w/o delays.
			if ($main._locked) {

				// Mark as switching.
				$body.addClass('is-switching');

				// Deactivate article.
				$article.removeClass('active');

				// Hide article, main.
				$article.hide();
				$main.hide();

				// Show footer, header.
				$footer.show();
				$header.show();

				// Unmark as visible.
				$body.removeClass('is-article-visible');

				// Unlock.
				$main._locked = false;

				// Unmark as switching.
				$body.removeClass('is-switching');

				// Window stuff.
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				return;

			}

			// Lock.
			$main._locked = true;

			// Deactivate article.
			$article.removeClass('active');

			// Hide article.
			setTimeout(function () {

				// Hide article, main.
				$article.hide();
				$main.hide();

				// Show footer, header.
				$footer.show();
				$header.show();

				// Unmark as visible.
				setTimeout(function () {

					$body.removeClass('is-article-visible');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function () {
						$main._locked = false;
					}, 325);

				}, 25);

			}, 325);

		};

		// Articles.
		$main_articles.each(function () {

			var $this = $(this);

			// Close.
			$('<div class="close">Close</div>')
				.appendTo($this)
				.on('click', function () {
					location.hash = '';
				});

			// Prevent clicks from inside article from bubbling.
			$this.on('click', function (event) {
				event.stopPropagation();
			});

		});

		// Events.
		$body.on('click', function (event) {

			// Article visible? Hide.
			if ($body.hasClass('is-article-visible'))
				$main._hide(true);

		});

		$window.on('keyup', function (event) {

			switch (event.keyCode) {

				case 27:

					// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

					break;

				default:
					break;

			}

		});

		$window.on('hashchange', function (event) {

			// Empty hash?
			if (location.hash == ''
				|| location.hash == '#') {

				// Prevent default.
				event.preventDefault();
				event.stopPropagation();

				// Hide.
				$main._hide();

			}

			// Otherwise, check for a matching article.
			else if ($main_articles.filter(location.hash).length > 0) {

				// Prevent default.
				event.preventDefault();
				event.stopPropagation();

				// Show article.
				$main._show(location.hash.substr(1));

			}

		});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
		if ('scrollRestoration' in history)
			history.scrollRestoration = 'manual';
		else {

			var oldScrollPos = 0,
				scrollPos = 0,
				$htmlbody = $('html,body');

			$window
				.on('scroll', function () {

					oldScrollPos = scrollPos;
					scrollPos = $htmlbody.scrollTop();

				})
				.on('hashchange', function () {
					$window.scrollTop(oldScrollPos);
				});

		}

		// Initialize.

		// Hide main, articles.
		$main.hide();
		$main_articles.hide();

		// Initial article.
		if (location.hash != ''
			&& location.hash != '#')
			$window.on('load', function () {
				$main._show(location.hash.substr(1), true);
			});

		// MODIFIED: 언어 토글 로직 추가
		// 언어 상태: 기본 'ko', localStorage로 유지
		var currentLang = localStorage.getItem('lang') || 'ko';
		var $langToggle = $('#lang-toggle');
		var $siteTitle = $('#site-title');
		var $siteDesc = $('#site-desc');
		var titleKo = '{{ site.title_ko }}';  // Jekyll에서 렌더링된 값 사용 (실제 빌드 시 치환됨)
		var titleEn = '{{ site.title_en }}';
		var descKo = '{{ site.description_ko }}';
		var descEn = '{{ site.description_en }}';

		function toggleLanguage() {
			if (currentLang === 'ko') {
				currentLang = 'en';
				$langToggle.text('EN');
				$siteTitle.text(titleEn);
				$siteDesc.text(descEn);
				$('.lang-content.ko').addClass('hidden');
				$('.lang-content.en').removeClass('hidden');
			} else {
				currentLang = 'ko';
				$langToggle.text('KO');
				$siteTitle.text(titleKo);
				$siteDesc.text(descKo);
				$('.lang-content.en').addClass('hidden');
				$('.lang-content.ko').removeClass('hidden');
			}
			localStorage.setItem('lang', currentLang);
		}

		// 초기 상태 적용
		if (currentLang === 'en') {
			toggleLanguage();  // en으로 시작하면 토글 실행
		}

		// 버튼 클릭 이벤트
		$langToggle.on('click', toggleLanguage);

	});

})(jQuery);