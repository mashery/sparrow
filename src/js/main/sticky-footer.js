/**
 * sticky-footer v2.0.2
 * Responsive sticky footers, by Chris Ferdinandi.
 * http://github.com/cferdinandi/sticky-footer
 *
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('stickyFooter', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.stickyFooter = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var stickyFooter = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, content, footer, eventTimeout;

	// Default settings
	var defaults = {
		content: '#content',
		callbackBefore: function () {},
		callbackAfter: function () {}
	};


	//
	// Methods
	//

	/**
	 * Get height of the viewport
	 * @private
	 * @return {Number} Height of the viewport in pixels
	 */
	var getViewportHeight = function () {
		return Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
	};

	/**
	 * Set page content min-height to push footer to the bottom of the page
	 * @public
	 */
	stickyFooter.setContentHeight = function ( content, footer, options ) {
		var settings = buoy.extend( settings || defaults, options || {} );  // Merge user options with defaults
		var viewHeight = getViewportHeight();
		var contentHeight = buoy.getHeight( content );
		var footerHeight = buoy.getHeight( footer );
		var footerOffset = buoy.getOffsetTop( footer );
		var gap = viewHeight - footerHeight - footerOffset;

		settings.callbackBefore();
		content.style.minHeight = ( contentHeight + gap ) + 'px';
		settings.callbackAfter();
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	stickyFooter.destroy = function () {

		if ( !settings ) return;

		// Unset styles
		document.documentElement.style.minHeight = '';
		document.body.style.minHeight = '';
		content.style.minHeight = '';
		window.removeEventListener( 'resize', eventThrottler, false );

		// Reset variables
		settings = null;
		content = null;
		footer = null;
		eventTimeout = null;

	};

	/**
	 * On window resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {NodeList} wrap The content wrapper for the page
	 * @param  {NodeList} footer The footer for the page
	 * @param  {Object} settings
	 */
	var eventThrottler = function () {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null;
				stickyFooter.setContentHeight( content, footer, settings );
			}, 66);
		}
	};

	/**
	 * Initialize Plugin
	 * @public
	 * @param {Object} options User settings
	 */
	stickyFooter.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		stickyFooter.destroy();

		// Selectors and variables
		settings = buoy.extend( defaults, options || {} ); // Merge user options with defaults
		content = document.querySelector( settings.content );
		footer = document.querySelector( '[data-sticky-footer]' );

		// If there is no content or no sticky footer, end function
		if ( !content || !footer ) return;

		// Stick footer
		document.documentElement.style.minHeight = '100%';
		document.body.style.minHeight = '100%';
		stickyFooter.setContentHeight( content, footer, settings );
		window.addEventListener( 'resize', eventThrottler, false); // Run Sticky Footer on window resize

	};


	//
	// Public APIs
	//

	return stickyFooter;

});