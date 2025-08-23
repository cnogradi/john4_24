/*
	Helios by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		settings = {

			// Carousels
				carousels: {
					speed: 4,
					fadeIn: true,
					fadeDelay: 250
				},

		};
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#hiden_articles'),
		$main_2 = $('#hiden_articles_2'),
		$visible = $('#visible_articles'),
		$main_articles = $main.children('article');
		$visible_2 = $('#reel'),
		$carosel_articles = $main_2.children('article');


	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '961px',   '1280px' ],
			narrow:    [ '841px',   '960px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			speed: 350,
			noOpenerFade: true,
			alignment: 'center'
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Nav.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					target: $body,
					visibleClass: 'navPanel-visible'
				});

					
			// Carousels.
		$('.carousel').each(function() {

			var	$t = $(this),
				$forward = $('<span class="forward"></span>'),
				$backward = $('<span class="backward"></span>'),
				$reel = $t.children('.reel'),
				$items = $reel.children('article');

			var	pos = 0,
				leftLimit,
				rightLimit,
				itemWidth,
				reelWidth,
				timerId;

			// Items.
				if (settings.carousels.fadeIn) {

					$items.addClass('loading');

					$t.scrollex({
						mode: 'middle',
						top: '-20vh',
						bottom: '-20vh',
						enter: function() {

							var	timerId,
								limit = $items.length - Math.ceil($window.width() / itemWidth);

							timerId = window.setInterval(function() {
								var x = $items.filter('.loading'), xf = x.first();

								if (x.length <= limit) {

									window.clearInterval(timerId);
									$items.removeClass('loading');
									return;

								}

								xf.removeClass('loading');

							}, settings.carousels.fadeDelay);

						}
					});

				}

			// Main.
				$t._update = function() {
					pos = 0;
					rightLimit = (-1 * reelWidth) + $window.width();
					leftLimit = 0;
					$t._updatePos();
				};

				$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

			// Forward.
				$forward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos -= settings.carousels.speed;

							if (pos <= rightLimit)
							{
								window.clearInterval(timerId);
								pos = rightLimit;
							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Backward.
				$backward
					.appendTo($t)
					.hide()
					.mouseenter(function(e) {
						timerId = window.setInterval(function() {
							pos += settings.carousels.speed;

							if (pos >= leftLimit) {

								window.clearInterval(timerId);
								pos = leftLimit;

							}

							$t._updatePos();
						}, 10);
					})
					.mouseleave(function(e) {
						window.clearInterval(timerId);
					});

			// Init.
				$window.on('load', function() {

					reelWidth = $reel[0].scrollWidth;

					if (browser.mobile) {

						$reel
							.css('overflow-y', 'hidden')
							.css('overflow-x', 'scroll')
							.scrollLeft(0);
						$forward.hide();
						$backward.hide();

					}
					else {

						$reel
							.css('overflow', 'visible')
							.scrollLeft(0);
						$forward.show();
						$backward.show();

					}

					$t._update();

					$window.on('resize', function() {
						reelWidth = $reel[0].scrollWidth;
						$t._update();
					}).trigger('resize');

				});

		});

		// Main.
		var	delay = 325,
			locked = false;

		show_func = function(id, initial, articles, main) {

		var $article = articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();
								$visible.hide();
								$visible_2.hide();

							// Show main, article.
								main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
										main.scrollTop();
										//	$window
										//		.scrollTop(0)
										//		.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();
									$visible.hide();
									$visible_2.hide();


								// Show main, article.
									main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
										main.scrollTop();
											//$window
											//	.scrollTop(720)
											//	.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}
					
				};
		// Methods.
			$main._show = function(id, initial) {
				show_func(id, initial, $main_articles, $main);
			}
		
			$main_2._show = function(id, initial) {
				show_func(id, initial, $carosel_articles, $main_2);
			}

			hide_func = function(addState, articles, main) {

				var $article = articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();
								$visible.show();
								$visible_2.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
							main.scrollTop();
								//$window
								//	.scrollTop(720)
							//		.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();
							$visible.show();
							$visible_2.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
								main.scrollTop();
									//$window
								//		.scrollTop(800)
								//		.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

			
			$main._hide = function(addState) {
				hide_func(addState, $main_articles, $main)
			}
		
			$main_2._hide = function(addState) {
				hide_func(addState, $carosel_articles, $main_2)
			}

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '#visible_articles';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

					// Articles.
			$carosel_articles.each(function() {

						var $this = $(this);
		
						// Close.
							$('<div class="close">Close</div>')
								.appendTo($this)
								.on('click', function() {
									location.hash = '#reel';
								});
		
						// Prevent clicks from inside article from bubbling.
							$this.on('click', function(event) {
								event.stopPropagation();
							});
		
					});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);
						$main_2._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);
								$main_2._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#'
					|| location.hash == '#visible_articles'
					|| location.hash == "#reel") {

						// Prevent default.
													// Hide.
							$main._hide();
							$main_2._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}
					else if ($carosel_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main_2._show(location.hash.substr(1));

					}
					

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_2.hide();
				$main_articles.hide();
				$carosel_articles.hide();
				

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						if ($main_articles.filter(location.hash).length > 0) {
							$main._show(location.hash.substr(1), true);
						}
						else if ($carosel_articles.filter(location.hash).length > 0) {
							$main_2._show(location.hash.substr(1), true);
						}
					});
	// Distinctives.
	var $distinctives = $('.distinctives a');
	var $catechismContent = $('#catechism-content');
	var catechismData = JSON.parse($('#catechism_data').html());
	var baptistEcclesiologyData = JSON.parse($('#baptist_ecclesiology_data').html());
	var currentOpen = null;


		$distinctives.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var distinctiveId = $(this).attr('id');
			var distinctiveName = $(this).text();
			var $this = $(this);

			// Remove active class from all distinctives and add to clicked one
			$distinctives.removeClass('active');
			$this.addClass('active');

			// Close other sections
			if (currentOpen && currentOpen !== distinctiveId) {
				$catechismContent.slideUp(300);
			}

			if (distinctiveId === 'regulative-link') {
				var html = '<div class="distinctive-section">';
				// Remove the title heading as requested
				// html += '<h3>' + catechismData.title + '</h3>';
				
				$.each(catechismData.questions, function(i, item) {
					html += '<div class="question-box" data-question="' + i + '">';
					html += '<div class="question-header">' + item.question + '</div>';
					html += '<div class="question-content">';
					$.each(item.verses, function(j, verse) {
						html += '<div class="verse">';
						html += '<a href="' + verse.link + '" target="_blank">' + verse.reference + '</a>: ';
						html += verse.text;
						html += '</div>';
					});
					html += '</div>';
					html += '</div>';
				});

				html += '</div>';
				
				$catechismContent.html(html).slideDown(300);
				currentOpen = distinctiveId;

				// Add click handlers for question boxes
				$('.question-box').on('click', function() {
					var $content = $(this).find('.question-content');
					var $header = $(this).find('.question-header');
					var $thisBox = $(this);
					
					if ($content.hasClass('open')) {
						$content.removeClass('open').slideUp(300);
						$header.removeClass('expanded');
					} else {
						// Close other open questions
						$('.question-content.open').removeClass('open').slideUp(300);
						$('.question-header.expanded').removeClass('expanded');
						$content.addClass('open').slideDown(300);
						$header.addClass('expanded');
					}
				});

			} else if (distinctiveId === 'baptist-ecclesiology-link') {
				var html = '<div class="distinctive-section">';
				// Remove the title heading as requested
				// html += '<h3>' + baptistEcclesiologyData.title + '</h3>';
				
				$.each(baptistEcclesiologyData.questions, function(i, item) {
					html += '<div class="question-box" data-question="' + i + '">';
					html += '<div class="question-header">' + item.question + '</div>';
					html += '<div class="question-content">';
					$.each(item.verses, function(j, verse) {
						html += '<div class="verse">';
						html += '<a href="' + verse.link + '" target="_blank">' + verse.reference + '</a>: ';
						html += verse.text;
						html += '</div>';
					});
					html += '</div>';
					html += '</div>';
				});

				html += '</div>';
				
				$catechismContent.html(html).slideDown(300);
				currentOpen = distinctiveId;

				// Add click handlers for question boxes
				$('.question-box').on('click', function() {
					var $content = $(this).find('.question-content');
					var $header = $(this).find('.question-header');
					var $thisBox = $(this);
					
					if ($content.hasClass('open')) {
						$content.removeClass('open').slideUp(300);
						$header.removeClass('expanded');
					} else {
						// Close other open questions
						$('.question-content.open').removeClass('open').slideUp(300);
						$('.question-header.expanded').removeClass('expanded');
						$content.addClass('open').slideDown(300);
						$header.addClass('expanded');
					}
				});

			} else {
				var html = '<div class="distinctive-section">';
				// Remove the title heading as requested
				// html += '<h3>' + distinctiveName + '</h3>';
				html += '<div class="question-box">';
				html += '<div class="question-header">Information Coming Soon</div>';
				html += '<div class="question-content">';
				html += '<p>This section is currently under development. Please check back later for detailed information about ' + distinctiveName + '.</p>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				
				$catechismContent.html(html).slideDown(300);
				currentOpen = distinctiveId;

				// Add click handler for the single question box
				$('.question-box').on('click', function() {
					var $content = $(this).find('.question-content');
					var $header = $(this).find('.question-header');
					if ($content.hasClass('open')) {
						$content.removeClass('open').slideUp(300);
						$header.removeClass('expanded');
					} else {
						$content.addClass('open').slideDown(300);
						$header.addClass('expanded');
					}
				});
			}
		});

})(jQuery);