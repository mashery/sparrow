/**
 * Houdini Subnav
 * @description  A Houdini expand-and-collapse functionality to documentation pages.
 * @version      1.0.0
 * @author       Chris Ferdinandi
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('houdiniSubnav', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.houdiniSubnav = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var houdiniSubnav = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, theNav, navs, navOriginal;

	// Default settings
	var defaults = {
		selectorNav: '#sub > ul',
		selectorNavs: '#sub > ul > li',
		isAccordion: false,
		iconShow: '+',
		iconHide: '&ndash;',
		iconAfter: true,
		iconMargin: '0.5em',
		initClass: 'js-houdini-subnav',
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * Set the first argument to `true` for a deep or recursive merge
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function ( obj ) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Create the link node
	 * @private
	 * @param  {Node}    navlink  The current link element
	 * @param  {Boolean} isActive If true, current link is the active one
	 * @param  {Number}  index    The index for the current link in the nodeslist
	 */
	var renderLink = function ( navlink, isActive, index ) {

		// Create link
		var toggle = document.createElement( 'a' );
		var location = settings.iconAfter ? navlink.nextSibling : navlink;
		toggle.href = '#docs-subnav-' + index;
		toggle.innerHTML = '<span class="collapse-text-show">' + settings.iconShow + '</span><span class="collapse-text-hide">' + settings.iconHide + '</span>';
		toggle.classList.add( 'collapse-toggle' );
		toggle.classList.add( 'js-collapse' );
		if ( isActive ) { toggle.classList.add( 'active' ); }
		if ( settings.isAccordion ) { toggle.setAttribute( 'data-group', 'docs-subnav' ); }

		// Add margin
		if ( settings.iconAfter ) {
			toggle.style.marginLeft = settings.iconMargin;
		} else {
			toggle.style.marginRight = settings.iconMargin;
		}

		// Inject link into DOM
		navlink.parentNode.insertBefore(toggle, location);

	};

	/**
	 * Loop through each subnav element and add expand-and-collapse attributes
	 * @private
	 * @param {NodesList} navs Nav elements
	 */
	var addAttributes = function ( navs ) {

		for (var i = 0; i < navs.length; i++) {

			// Get subnav
			var subnav = navs[i].querySelector( 'ul' );

			// If no subnav, move on to the next nav element
			if ( !subnav ) continue;

			// Get subnav link
			var navlink = navs[i].firstChild;

			// Determine if nav is active
			var isActive = navs[i].classList.contains( 'active' );

			// Remove .active class from parent li
			navs[i].classList.remove( 'active' );

			// Render the link
			renderLink( navlink, isActive, i );

			// Add classes and ID to subnav
			subnav.classList.add( 'collapse' );
			subnav.id = 'docs-subnav-' + i;
			if ( isActive ) { subnav.classList.add( 'active' ); }

			// If subnav has subnav, run again
			var subSubNavs = subnav.querySelectorAll( 'ul > li' );
			addAttributes( subSubNavs );

		}

	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	houdiniSubnav.destroy = function () {

		if ( !settings ) return;

		// Remove init class
		document.documentElement.classList.remove( settings.initClass );

		// Restore original nav
		theNav.innerHTML = navOriginal;

		// Reset variables
		settings = null;
		theNav = null;
		navs = null;

	};

	/**
	 * Initialize Houdini
	 * @public
	 * @param {Object} options User settings
	 */
	houdiniSubnav.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		houdiniSubnav.destroy();

		// Variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		theNav = document.querySelector( settings.selectorNav );
		navs = document.querySelectorAll( settings.selectorNavs );

		// If set to only run on Docs and not docs page, end
		if ( !document.body.classList.contains( 'page-docs' ) ) return;

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Save original nav
		navOriginal = theNav.innerHTML;

		// Add Houdini hooks to subnav
		addAttributes( navs );

	};


	//
	// Public APIs
	//

	return houdiniSubnav;

});