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
		var catechismData = JSON.parse($('#catechism_data').html());

		$distinctives.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var distinctiveId = $(this).attr('id');

			if (distinctiveId === 'regulative-link') {
				var html = '<article>';
				html += '<header><h3><a href="#regulative">' + catechismData.title + '</a></h3></header>';

				$.each(catechismData.questions, function(i, item) {
					html += '<p><h4>' + item.question + '</h4>';
					$.each(item.verses, function(j, verse) {
						html += '<a href="' + verse.link + '">' + verse.reference + '</a>: ';
						html += verse.text;
						if (j < item.verses.length - 1) {
							html += '<br>';
						}
					});
					html += '</p>';
				});

				html += '</article>';
				$catechismContent.html(html);
			} else {
				$catechismContent.html('<p>Information for this distinctive is not yet available.</p>');
			}
		});

})(jQuery);