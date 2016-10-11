/**
 * TinyMCEHacks.js
 * Adds required data attributes that get stripped out when using TinyMCE.
 */

// Astro
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var navs = document.querySelectorAll( '.js-nav' );

	// Add attributes
	buoy.forEach(navs, function (nav) {
		if ( nav.getAttribute( 'data-nav-toggle' ) ) return; // Skip if attribute already exists
		var id = nav.href ? '#' + nav.href.split('#')[1] : '#';
		nav.setAttribute( 'data-nav-toggle', id );
	});

})(window, document);


// Sticky Footer
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var footers = document.querySelectorAll( '.js-sticky-footer' );

	// Add attributes
	buoy.forEach(footers, function (footer) {
		if ( footer.getAttribute( 'data-sticky-footer' ) ) return; // Skip if attribute already exists
		footer.setAttribute( 'data-sticky-footer', 'true' );
	});

})(window, document);


// Right Height
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var containers = document.querySelectorAll( '.js-right-height' );
	var contents = document.querySelectorAll( '.js-right-height-content' );

	// Add attributes
	buoy.forEach(containers, function (container) {
		if ( container.getAttribute( 'data-right-height' ) ) return; // Skip if attribute already exists
		container.setAttribute( 'data-right-height', 'true' );
	});
	buoy.forEach(contents, function (content) {
		if ( content.getAttribute( 'data-right-height-content' ) ) return; // Skip if attribute already exists
		content.setAttribute( 'data-right-height-content', 'true' );
	});

})(window, document);


// Modals
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var toggles = document.querySelectorAll( '.js-modal' );
	var windows = document.querySelectorAll( '.js-modal-window' );
	var closers = document.querySelectorAll( '.js-modal-close' );

	// Add attributes
	buoy.forEach(toggles, function (toggle) {
		if ( toggle.getAttribute( 'data-modal' ) ) return; // Skip if attribute already exists
		var id = toggle.href ? '#' + toggle.href.split('#')[1] : '#';
		toggle.setAttribute( 'data-modal', id );
	});
	buoy.forEach(windows, function (win) {
		if ( win.getAttribute( 'data-modal-window' ) ) return; // Skip if attribute already exists
		win.setAttribute( 'data-modal-window', 'true' );
	});
	buoy.forEach(closers, function (closer) {
		if ( closer.getAttribute( 'data-modal-close' ) ) return; // Skip if attribute already exists
		closer.setAttribute( 'data-modal-close', 'true' );
	});

})(window, document);


// Houdini
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var toggles = document.querySelectorAll( '.js-collapse' );

	// Add attributes
	buoy.forEach(toggles, function (toggle) {
		if ( toggle.getAttribute( 'data-collapse' ) ) return; // Skip if attribute already exists
		toggle.setAttribute( 'data-collapse' );
	});

})(window, document);


// Tabby
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var navs = document.querySelectorAll( '.js-tabs' );
	var tabs = document.querySelectorAll( '.js-tab' );
	var contents = document.querySelectorAll( '.js-tabs-content' );
	var panes = document.querySelectorAll( '.js-tabs-pane' );


	// Add attributes

	buoy.forEach(navs, function (nav) {
		if ( nav.getAttribute( 'data-tabs' ) ) return; // Skip if attribute already exists
		nav.setAttribute( 'data-tabs', true );
	});

	buoy.forEach(tabs, function (tab) {
		if ( tab.getAttribute( 'data-tab' ) ) return; // Skip if attribute already exists
		tab.setAttribute( 'data-tab', true );
	});

	buoy.forEach(contents, function (content) {
		if ( content.getAttribute( 'data-tabs-content' ) ) return; // Skip if attribute already exists
		content.setAttribute( 'data-tabs-content', true );
	});

	buoy.forEach(panes, function (pane) {
		if ( pane.getAttribute( 'data-tabs-pane' ) ) return; // Skip if attribute already exists
		pane.setAttribute( 'data-tabs-pane', true );
	});

})(window, document);


// Smooth Scroll
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var links = document.querySelectorAll( '.js-scroll' );

	// Add attributes
	buoy.forEach(links, function (link) {
		if ( link.getAttribute( 'data-scroll' ) ) return; // Skip if attribute already exists
		link.setAttribute( 'data-scroll', 'true' );
	});

})(window, document);


// Gumshoe
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var headers = document.querySelectorAll( '.js-gumshoe-header' );
	var lists = document.querySelectorAll( '.js-gumshoe' );

	// Add attributes
	buoy.forEach(headers, function (header) {
		if ( header.getAttribute( 'data-gumshoe-header' ) ) return; // Skip if attribute already exists
		header.setAttribute( 'data-gumshoe-header', 'true' );
	});
	buoy.forEach(lists, function (list) {
		if ( list.getAttribute( 'data-gumshoe' ) ) return; // Skip if attribute already exists
		list.setAttribute( 'data-gumshoe', 'true' );
	});

})(window, document);


// Dropdowns
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var dropdowns = document.querySelectorAll( '.js-dropdown' );
	var menus = document.querySelectorAll( '.js-dropdown-menu' );

	// Add attributes
	buoy.forEach(dropdowns, function (dropdown) {
		if ( dropdown.getAttribute( 'data-dropdown' ) ) return; // Skip if attribute already exists
		dropdown.setAttribute( 'data-dropdown', 'true' );
	});
	buoy.forEach(menus, function (menu) {
		if ( menu.getAttribute( 'data-dropdown-menus' ) ) return; // Skip if attribute already exists
		menu.setAttribute( 'data-dropdown-menu', 'true' );
	});

})(window, document);


// Responsive Tables
;(function (window, document, undefined) {

	// Feature test
	if ( !document.querySelector ) return;

	// Get all responsive tables
	var tables = document.querySelectorAll( '.table-responsive' );

	/**
	 * Add data-label attributes
	 * @param {node} table The table to add data-label attributes to
	 */
	var addLabels = function ( table ) {

		// Variables
		var labels = table.querySelectorAll( 'th' );
		var rows = table.querySelectorAll( 'tr' );

		// Sanity check
		if ( !labels || !rows ) return;

		// Loop through each row
		buoy.forEach(rows, function (row) {

			// Get cells within the row
			var cells = row.querySelectorAll( 'td' );

			buoy.forEach(cells, function (cell, index) {
				cell.setAttribute( 'data-label', labels[index].innerHTML );
			});

		});

	};

	// Loop through each responsive table
	buoy.forEach(tables, function (table) {
		addLabels( table );
	});

})(window, document);