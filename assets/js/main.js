(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer');

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

	// Distinctives.
		var $distinctives = $('.distinctives a');
		var $catechismContent = $('#catechism-content');

		$distinctives.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var distinctiveId = $(this).attr('id');

			if (distinctiveId === 'regulative-link') {
				$catechismContent.load('catechism.html', function() {
					// Wrap the loaded content in an article tag
					$catechismContent.html('<article>' + $catechismContent.html() + '</article>');
				});
			} else {
				$catechismContent.html('<p>Information for this distinctive is not yet available.</p>');
			}
		});

})(jQuery);