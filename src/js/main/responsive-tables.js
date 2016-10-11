/**
 * Responsive tables
 * @description Automatically make tables on documentation page responsive
 * @version     1.0.0
 * @author      Chris Ferdinandi
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('responsiveTables', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.responsiveTables = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var responsiveTables = {}; // Object for public APIs
	var supports = !!document.querySelector; // Feature test
	var settings, tables;

	// Default settings
	var defaults = {
		selector: 'table',
		responsiveClass: 'table-responsive',
		initClass: 'js-responsive-tables',
		callback: function () {},
	};


	//
	// Methods
	//

	/**
	 * Add data-label attributes
	 * @param {node} table The table to add data-label attributes to
	 */
	var addLabels = function ( table ) {

		// Variables
		var labels = table.querySelectorAll( 'th' );
		var rows = table.querySelectorAll( 'tr' );

		// Sanity check
		if ( labels.length === 0 || rows.length === 0 ) return;

		// Loop through each row
		for ( var i = 0, len = rows.length; i < len; i++ ) {

			// Get cells within the row
			var cells = rows[i].querySelectorAll( 'td' );

			// For each cell, add a data-label
			for ( var n = 0, len2 = cells.length; n < len2; n++ ) {
				if ( !labels[n] ) continue;
				cells[n].setAttribute( 'data-label', labels[n].innerHTML );
			}
		}

	};

	/**
	 * Add attributes to the tables
	 * @param {NodeList} tables The tables
	 */
	var addAttributes = function ( tables ) {
		for ( var i = 0, len = tables.length; i < len; i++ ) {
			tables[i].classList.add( settings.responsiveClass );
			addLabels( tables[i] );
		}
	};


	/**
	 * Destroy the current initialization.
	 * @public
	 */
	responsiveTables.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove responsive class
		for ( var i = 0, len = tables.length; i < len; i++ ) {
			tables[i].classList.remove( settings.responsiveClass );
		}

		// Reset variables
		settings = null;
		tables = null;

	};

	/**
	 * Initialize Responsive Tables
	 * @public
	 * @param {Object} options User settings
	 */
	responsiveTables.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing inits
		responsiveTables.destroy();

		// Merge user options with defaults
		settings = buoy.extend( true, defaults, options || {} );

		// Only run on documentation and custom pages
		if ( !document.body.classList.contains( 'page-docs' ) && !document.body.classList.contains( 'page-page' ) ) return;

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Get all responsive tables
		tables = document.querySelectorAll( settings.selector );

		// Make them responsive
		addAttributes( tables );

		// Run callback
		settings.callback();

	};


	//
	// Public APIs
	//

	return responsiveTables;

});