/*!
 * YOUR-CLIENT-NAME-WITHOUT-SPACES v1.0.0: Portal theme for YOUR-CLIENT-NAME
 * (c) 2016 YOUR-NAME
 * MIT License
 * https://stash.mashery.com/stash/users/cferdinandi/repos/sparrow/browse
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buoy = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	// Object for public APIs
	var buoy = {};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists.
	 * @author Todd Motto
	 * @link   https://github.com/toddmotto/foreach
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function}              callback   Callback function for each iteration
	 * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	buoy.forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	buoy.extend = function () {

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
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
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
	 * Get the height of an element.
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	buoy.getHeight = function ( elem ) {
		return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
	};

	/**
	 * Get an element's distance from the top of the Document.
	 * @param  {Node} elem The element
	 * @return {Number}    Distance from the top in pixels
	 */
	buoy.getOffsetTop = function ( elem ) {
		var location = 0;
		if (elem.offsetParent) {
			do {
				location += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}
		return location >= 0 ? location : 0;
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	buoy.getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Get an element's parents.
	 * @param  {Node}   elem     The element
	 * @param  {String} selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Array}           An array of matching nodes
	 */
	buoy.getParents = function ( elem, selector ) {

		// Variables
		var parents = [];
		var supports = 'classList' in document.documentElement;
		var firstChar, attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( selector ) {
			firstChar = selector.charAt(0);
			if ( firstChar === '[' ) {
				selector = selector.substr(1, selector.length - 2);
				attribute = selector.split( '=' );

				if ( attribute.length > 1 ) {
					value = true;
					attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
				}
			}
		}

		// Get matches
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( selector ) {

				// If selector is a class
				if ( firstChar === '.' ) {
					if ( supports ) {
						if ( elem.classList.contains( selector.substr(1) ) ) {
							parents.push( elem );
						}
					} else {
						if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
							parents.push( elem );
						}
					}
				}

				// If selector is an ID
				if ( firstChar === '#' ) {
					if ( elem.id === selector.substr(1) ) {
						parents.push( elem );
					}
				}

				// If selector is a data attribute
				if ( firstChar === '[' ) {
					if ( elem.hasAttribute( attribute[0] ) ) {
						if ( value ) {
							if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
								parents.push( elem );
							}
						} else {
							parents.push( elem );
						}
					}
				}

				// If selector is a tag
				if ( elem.tagName.toLowerCase() === selector ) {
					parents.push( elem );
				}

			} else {
				parents.push( elem );
			}

		}

		// Return parents if any exist
		if ( parents.length === 0 ) {
			return null;
		} else {
			return parents;
		}

	};

	/**
	 * Get an element's siblings.
	 * @param  {Node} elem The element
	 * @return {Array}     An array of sibling nodes
	 */
	buoy.getSiblings = function ( elem ) {

		// Variables
		var siblings = [];
		var sibling = elem.parentNode.firstChild;

		// Loop through all sibling nodes
		for ( ; sibling; sibling = sibling.nextSibling ) {
			if ( sibling.nodeType === 1 && sibling !== elem ) {
				siblings.push( sibling );
			}
		}

		return siblings;

	};

	/**
	 * Get data from a URL query string.
	 * @param  {String} field The field to get from the URL
	 * @param  {String} url   The URL to parse
	 * @return {String}       The field value
	 */
	buoy.getQueryString = function ( field, url ) {
		var href = url ? url : window.location.href;
		var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
		var string = reg.exec(href);
		return string ? string[1] : null;
	};


	//
	// Public APIs
	//

	return buoy;

}));
/**
 * addNavItem.js
 * @description  Add a navigation item to the menu if all 6 spots are used up
 * @version  1.0.0
 * @author  Chris Ferdinandi
 * @param {string}   target  The (case insensitive) text label of the menu item that you'd like to add the item before or after. Ex. 'Try our APIs'
 * @param {string}   text    The text for the menu item
 * @param {string}   url     The URL for the new menu item
 * @param {boolean]} before  If true, place new item before target instead of after it [optional]
 * @param {string}   nav     Selector for the nav [optional]
 */
var addNavItem = function ( target, text, url, before, nav ) {

	'use strict';

	// Feature test
	var supports = 'querySelector' in document;
	if ( !supports ) return;

	// Sanity check
	if ( !target || !text || !url ) return;

	// Variables
	nav = nav ? nav : document.querySelector( '#nav-1-content' );
	var items = nav.querySelectorAll( 'a' );
	var menu;

	// Create menu from dropdown array
	function createMenu () {
		menu = document.createElement( 'li' );
		menu.innerHTML = '<a href="' + url + '">' + text + '</a>';
	}

	// Locate the nav item and insert the menu
	for ( var i = 0, len = items.length; i < len; i++ ) {
		if ( items[i].innerHTML.trim().toLowerCase() !== target.toLowerCase() ) continue;
		createMenu();
		var location = before ? items[i].parentNode : items[i].parentNode.nextSibling;
		items[i].parentNode.parentNode.insertBefore( menu, location );
		break;
	}

};
/**
 * addPrismHooks.js
 * @description  Adds class="lang-*" to TinyMCE-generated code snippets
 * @version  1.0.0
 * @author  Chris Ferdinandi
 */
portalReady((function () {

	// Get all code snippets
	var codes = document.querySelectorAll( 'pre' );

	var getLangClass = function ( lang ) {

		var langClass = '';

		if ( lang === 'bash' ) { langClass = 'lang-bash'; }
		if ( lang === 'csharp' ) { langClass = 'lang-clike'; }
		if ( lang === 'cpp' ) { langClass = 'lang-clike'; }
		if ( lang === 'css' ) { langClass = 'lang-css'; }
		if ( lang === 'java' ) { langClass = 'lang-java'; }
		if ( lang === 'jscript' ) { langClass = 'lang-javascript'; }
		if ( lang === 'php' ) { langClass = 'lang-php'; }
		if ( lang === 'python' ) { langClass = 'lang-python'; }
		if ( lang === 'ruby' ) { langClass = 'lang-ruby'; }
		if ( lang === 'xml' ) { langClass = 'lang-markup'; }

		return langClass;

	};

	buoy.forEach(codes, (function ( code ) {
		var lang = /brush: (.*?);/.exec( code.className );
		if ( !lang || Object.prototype.toString.call( lang ) !== '[object Array]' || lang.length < 2 ) return;
		var langClass = getLangClass( lang[1] );
		code.classList.add( langClass );
	}));

}));
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.astro = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var astro = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var settings;

	// Default settings
	var defaults = {
		selector: '[data-nav-toggle]',
		toggleActiveClass: 'active',
		navActiveClass: 'active',
		initClass: 'js-astro',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
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
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
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
	 * Get the closest matching element up the DOM tree
	 * @private
	 * @param {Element} elem Starting element
	 * @param {String} selector Selector to match against (class, ID, or data attribute)
	 * @return {Element} Returns null if no match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Show and hide navigation menu
	 * @public
	 * @param  {Element} toggle Element that triggered the toggle
	 * @param  {String} navID The ID of the navigation element to toggle
	 * @param  {Object} settings
	 * @param  {Event} event
	 */
	astro.toggleNav = function ( toggle, navID, options, event ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var nav = document.querySelector(navID);

		toggle.classList.toggle( settings.toggleActiveClass ); // Toggle the '.active' class on the toggle element
		nav.classList.toggle( settings.navActiveClass ); // Toggle the '.active' class on the menu
		settings.callback( toggle, navID ); // Run callbacks after toggling nav

	};

	/**
	 * Handle click event methods
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, settings.selector);
		if ( toggle ) {
			// Prevent default click event
			if ( toggle.tagName.toLowerCase() === 'a') {
				event.preventDefault();
			}
			// Toggle nav
			astro.toggleNav( toggle, toggle.getAttribute('data-nav-toggle'), settings );
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	astro.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', eventHandler, false);
		settings = null;
	};

	/**
	 * Initialize Astro
	 * @public
	 * @param {Object} options User settings
	 */
	astro.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		astro.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults

		// Listeners and methods
		document.documentElement.classList.add( settings.initClass ); // Add class to HTML element to activate conditional CSS
		document.addEventListener('click', eventHandler, false); // Listen for click events and run event handler

	};


	//
	// Public APIs
	//

	return astro;

}));
/**
 * breadcrumbs.js
 * @description Add breadcrumbs to the Portal
 * @version     1.0.0
 * @author      Chris Ferdinandi
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('breadcrumbs', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.breadcrumbs = factory(root);
	}
})(window || this, (function (root) {

	'use strict';

	//
	// Variables
	//

	var breadcrumbs = {}; // Object for public APIs
	var supports = !!document.querySelector; // Feature test
	var settings, path;

	// Default settings
	var defaults = {
		pages: 'all', // all | docs | page | blog | forum | ioDocs | account
		exclude: '.dom-landing',
		selector: '#page',
		docs: 'Documentation',
		ioDocs: 'IO-Docs',
		forumAddCategory: 'Add Category',
		accountMyAccount: 'My Account',
		accountMyKeys: 'My API Keys',
		accountMyApps: 'My Applications',
		memberManage: 'Manage My Account',
		memberEmail: 'Change Email',
		memberPassword: 'Change Password',
		initClass: 'js-breadcrumbs',
		containerClass: 'container padding-top-small text-muted link-plain',
		listClass: 'list-inline list-inline-breadcrumbs',
		callback: function () {},
	};


	//
	// Methods
	//

	/**
	 * Convert string to title case
	 * @private
	 * @param  {String} str The string to convert to title case
	 * @return {String}     Title cased string
	 * @url http://stackoverflow.com/a/4878800/1293256
	 * @todo  If IO-Docs, custom override
	 */
	var toTitleCase = function  ( str ) {

		// Variables
		var titleCase;

		// Otherwise, transform to title case
		titleCase = str.replace( /\w\S*/g,
			(function ( txt ) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}));

		// Manual overrides for certain pages
		if ( titleCase === 'Docs' ) titleCase = settings.docs; // Documentation
		if ( titleCase === 'Io-docs' ) titleCase = settings.ioDocs; // IO-Docs
		if ( titleCase === 'Category-add' ) titleCase = settings.forumAddCategory; // New Forum Category
		if ( titleCase === 'Mykeys' ) titleCase = settings.accountMyKeys; // My API Keys
		if ( titleCase === 'Myapps' ) titleCase = settings.accountMyApps; // My Applications
		if ( document.body.id === 'page-member' && titleCase === 'Edit' ) titleCase = settings.memberManage; // Manage Account
		if ( document.body.id === 'page-member' && titleCase === 'Email' ) titleCase = settings.memberEmail; // Change email
		if ( document.body.id === 'page-member' && titleCase === 'Passwd' ) titleCase = settings.memberPassword; // Change password

		// @todo If forum and not "add category", return empty after 'forum'

		// console.log(str);

		return titleCase;

	};

	/**
	 * Remove junk from the path and set variables
	 * @private
	 * @param  {String} path The URL path
	 * @return {[type]}      [description]
	 */
	var sanitizePath = function () {

		// If Docs or Blog, remove /read and /Home
		if ( document.body.classList.contains( 'page-docs' ) || document.body.classList.contains( 'page-blog' ) ) {
			path = path.replace( /\/read/, '' ).replace( /\/Home/, '' );
		}

		// If Forum, remove /read
		if ( document.body.classList.contains( 'page-forum' ) ) {
			path = path.replace( /\/read/, '' );
		}

		// If Profile, remove redundant /profile
		if ( document.body.classList.contains( 'page-profile' ) ) {
			path = path.substring( path.indexOf( '/profile' ), 8 );
		}

		// Remove leading and trailing slashes
		if ( path.charAt(0) === '/' ) { path = path.substr(1); }
		if ( path.charAt( path.length - 1 ) === '/' ) { path = path.substr(0, path.length - 1); }

	};

	/**
	 * Create breadcrumb markup
	 * @private
	 * @return {String} The breadcrumb markup
	 */
	var createBreadcrumbs = function () {

		// Variables
		var crumbs = path.split( '/' );
		var count = crumbs.length;
		var breadcrumbs = '<li><a href="/">Home</a></li>';
		var isForum = document.body.classList.contains( 'page-forum' );

		// If it's the landing page, remove link from "Home" breadcrumb
		if ( document.documentElement.classList.contains( 'dom-landing' ) ) breadcrumbs = '<li>Home</li>';

		// Create breadcrumb links
		buoy.forEach(crumbs, (function (crumb, index) {

			// If crumb is empty or it's the forum, bail
			if ( crumb === '' || isForum ) return;

			// Create the title
			var title = toTitleCase( crumb.replace( /_/g, ' ' ) );

			// If the last crumb, don't add a link
			if ( index === count - 1 ) {
				breadcrumbs += '<li>' + title + '</li>';
				return;
			}

			// If is account/member page, override App/Member crumb
			if ( document.body.classList.contains( 'page-apps' ) || document.body.classList.contains( 'page-member' ) ) {
				if ( title === 'Apps' || title === 'Member'  ) {
					breadcrumbs += '<li><a href="/apps/mykeys">' + settings.accountMyAccount + '</a></li>';
					return;
				}
			}

			// Otherwise, create a linked crumb
			breadcrumbs += '<li><a href="' + crumb + '">' + title + '</a></li>';

		}));

		// Custom breadcrumb for the forum
		if ( isForum ) {
			if ( document.documentElement.classList.contains( 'dom-forum' ) ) {
				breadcrumbs += '<li>Forum</li>';
			} else {
				breadcrumbs += '<li><a href="/forum">Forum</a></li>';
			}
		}

		return '<div class="' + settings.containerClass + '" id="nav-breadcrumbs"><ul class="' + settings.listClass + '" id="nav-breadcrumbs-list">' + breadcrumbs + '</ul></div>';

	};

	/**
	 * Load breadcrumbs into the DOM
	 * @private
	 */
	var loadCrumbs = function () {

		// Remove junk from the path
		sanitizePath();

		// Create breadcrumbs
		var breadcrumbs = createBreadcrumbs();

		// Inject breadcrumbs into the DOM
		loadHTML( breadcrumbs, document.querySelector( settings.selector ) );

		// Run callback
		settings.callback();

	};

	/**
	 * Check to see if the page is on the exclude/include list
	 * @private
	 * @return {Boolean} Returns true if the breadcrumbs should be loaded onto the page
	 */
	var okToRun = function () {

		// Variables
		var selectors = '';

		// Don't run on explicitly excluded pages
		if ( settings.exclude && document.querySelector( settings.exclude ) ) return false;

		// Don't run on the wiki page
		if ( document.body.classList.contains( 'page-wiki' ) ) return false;

		// Create selector(s)
		if ( Object.prototype.toString.call( settings.pages ) === '[object Array]' ) {

			// Get number of pages
			var count = settings.pages.length;

			// For each one, create a selector
			buoy.forEach(settings.pages, (function (page, index) {

				// Add a comma delimiter to all but the last item
				var delimiter = index + 1 === count ? '' : ', ';

				// Special dual class for account pages
				if ( page === 'account' ) {
					selectors += '.page-account, .page-member';
					return;
				}

				// Create selector
				selectors += '.page-' + page + delimiter;

			}));
		} else {

			// If it should be run on all pages, return true
			if ( settings.pages === 'all' ) return true;

			// Create selector
			selectors = '.page-' + settings.pages;

		}

		// If selectors exist, OK to run.
		// Otherwise, return false.
		var pages = document.querySelectorAll( selectors );
		if ( pages.length === 0 ) return false;
		return true;

	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	breadcrumbs.destroy = function () {

		if ( !settings ) return;

		// Remove init class
		document.documentElement.classList.remove( settings.initClass );

		// Remove breadcrumbs from the DOM
		var breadcrumbs = document.querySelector( '#nav-breadcrumbs' );
		if ( breadcrumbs ) {
			breadcrumbs.parentNode.removeChild( breadcrumbs );
		}

		// Reset variables
		settings = null;
		path = null;

	};

	/**
	 * Initialize Houdini
	 * @public
	 * @param {Object} options User settings
	 */
	breadcrumbs.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		breadcrumbs.destroy();

		// Merge user options with defaults
		settings = buoy.extend( true, defaults, options || {} );

		// Check if it's ok to run based on user settings
		if ( !okToRun() ) return;

		// Get the current URL path
		path = window.location.pathname;

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Load breadcrumbs onto the page
		loadCrumbs();

	};


	//
	// Public APIs
	//

	return breadcrumbs;

}));
/**
 * clickToHighlight.js
 * @description  Highlight text when clicked.
 * @version  1.0.0
 * @author  Chris Ferdinandi
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('clickToHighlight', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.clickToHighlight = factory(root);
	}
})(window || this, (function (root) {

	'use strict';

	//
	// Variables
	//

	var clickToHighlight = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, range;

	// Default settings
	var defaults = {
		selector: 'pre',
		initClass: 'js-click-highlight',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Highlight clicked text.
	 * @param {Node} elem The elem whose content to highlight.
	 */
	clickToHighlight.highlight = function ( elem ) {
		if ( document.selection ) {
			range = document.body.createTextRange();
			range.moveToElementText( elem );
			range.select();
		} else if ( window.getSelection ) {
			range = document.createRange();
			range.selectNode( elem );
			window.getSelection().addRange( range );
		}
		settings.callback();
	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = buoy.getClosest( event.target, settings.selector );
		if ( toggle ) {
			clickToHighlight.highlight( toggle );
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	clickToHighlight.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', eventHandler, false);
		settings = null;
		range = null;
	};

	/**
	 * Initialize Houdini
	 * @public
	 * @param {Object} options User settings
	 */
	clickToHighlight.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		clickToHighlight.destroy();

		// Merge user options with defaults
		settings = buoy.extend( defaults, options || {} );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Listen for all click events
		document.addEventListener('click', eventHandler, false);

	};


	//
	// Public APIs
	//

	return clickToHighlight;

}));
/**
 * createDropdown.js
 * @description  Dynamically create dropdown menus
 * @version  1.0.0
 * @author  Chris Ferdinandi
 * @param  {string} target    The (case insensitive) text label of the menu item that you'd like to add the dropdown to. Ex. 'Try our APIs'
 * @param  {array}  dropdown  An array of objects with the dropdown menu data. Ex. [{text: 'Something', url: '#'}, {text: 'Something Else', url: '#'}]
 * @param  {string} nav       Selector for the nav [optional]
 */
var createDropdown = function ( target, dropdown, nav ) {

	'use strict';

	// Feature test
	var supports = 'querySelector' in document;
	if ( !supports ) return;

	// Sanity check
	if ( !target || !dropdown ) return;

	// Variables
	nav = nav ? nav : document.querySelector( '#nav-1-content' );
	var items = nav.querySelectorAll( 'a' );
	var menu;

	// Create menu from dropdown array
	var createMenu = function () {
		menu = document.createElement( 'div' );
		menu.className = 'dropdown-menu dropdown-right';
		menu.setAttribute( 'data-dropdown-menu', true );
		for ( var i = 0, len = dropdown.length; i < len; i++ ) {
			menu.innerHTML += '<li><a href="' + dropdown[i].url + '">' + dropdown[i].text + '</a></li>';
		}
		menu.innerHTML = '<ul>' + menu.innerHTML + '</ul>';
	};

	// Add attributes to the parent
	var addAttributes = function ( elem ) {
		elem.parentNode.insertBefore( menu, items[i].nextSibling );
		elem.parentNode.className += ' dropdown';
		elem.parentNode.setAttribute( 'data-dropdown', true );
	};

	// Locate the nav item and insert the menu
	for ( var i = 0, len = items.length; i < len; i++ ) {
		if ( items[i].innerHTML.trim().toLowerCase() !== target.toLowerCase() ) continue;
		createMenu();
		addAttributes( items[i] );
		break;
	}

};
/**
 * loadCustomLogo.js
 * Add custom logo to the Portal.
 */
var loadCustomLogo = function ( logo ) {

	'use strict';

	// Feature test
	if ( !document.querySelector || !window.addEventListener ) return;

	// Get nav logo
	var navLogo = document.querySelector( '#nav-1-logo' );

	// Sanity check
	if ( !logo || !navLogo ) return;

	// Load logo
	navLogo.innerHTML = logo;

};
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.drop = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var drop = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var isTouch = 'ontouchstart' in document; // Check for touch support
	var settings;

	// Default settings
	var defaults = {
		selector: '[data-dropdown]',
		activeClass: 'active',
		initClass: 'js-drop',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
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
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
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
	 * Get closest DOM element up the tree that contains a class or data attribute
	 * @param  {Element} elem The base element
	 * @param  {String} selector The class or data attribute to look for
	 * @return {Boolean|Element} False if no match
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Close all dropdown menus
	 * @param {Object} options Custom settings
	 * @public
	 */
	drop.closeDrops = function () {

		// Get dropdowns
		var drops = document.querySelectorAll( settings.selector );

		// Close all the dropdowns
		forEach(drops, (function (drop) {
			drop.classList.remove( settings.activeClass );
		}));

	};

	/**
	 * Open a dropdown menu
	 * @public
	 * @param  {Element} toggle  Element that triggered the expand or collapse
	 * @param  {Object}  options Custom settings
	 */
	drop.openDrop = function ( toggle, options ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults

		// Close any open dropdown menus
		drop.closeDrops();

		// Open the toggled dropdown menu
		toggle.classList.add( settings.activeClass );

		// Run callbacks after drop toggle
		settings.callback( toggle );

	};

	/**
	 * Handle toggle and document click events
	 * @param {Event} event
	 * @private
	 */
	var clickHandler = function (event) {

		// Variables
		var toggle = event.target;
		var menu = getClosest( toggle, settings.selector );

		if ( menu ) {
			// If dropdown menu, do nothing
			return;
		} else {
			// If document body, close open dropdown menus
			drop.closeDrops();
		}

	};

	var focusHandler = function (event) {

		// Variables
		var target = event.target;
		var toggle = getClosest( target, settings.selector );

		// If focused element isn't dropdown, close all dropdowns and end
		if ( !toggle ) {
			drop.closeDrops();
			return;
		}

		// If focused element is currently active dropdown, end
		if ( toggle.classList.contains( settings.activeClass ) ) {
			return;
		}

		// Otherwise, activate the dropdown
		drop.openDrop(toggle, settings);

	};

	var hoverHandler = function (event) {

		// Variables
		var target = event.target;
		var toggle = getClosest( target, settings.selector );

		// If a dropdown menu, activate it
		if ( toggle && !toggle.classList.contains( settings.activeClass ) ) {
			drop.openDrop(toggle, settings); // Open this dropdown

			// Prevent default on touch devices
			if ( isTouch ) {
				event.preventDefault();
			}
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	drop.destroy = function () {

		if ( !settings ) return;

		// Remove init class
		document.documentElement.classList.remove( settings.initClass );

		// Remove event listeners
		document.removeEventListener('click', clickHandler, false);
		document.removeEventListener('focusin', focusHandler, false);
		document.removeEventListener('mouseover', hoverHandler, false);

		// Close all dropdowns
		drop.closeDrops();

		// Reset variables
		settings = null;

	};

	/**
	 * Initialize Drop
	 * @public
	 * @param {Object} options User settings
	 */
	drop.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		drop.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		var toggles = document.querySelectorAll( settings.selector + ' > a' );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Event listeners
		document.addEventListener('click', clickHandler, false);
		document.addEventListener('focus', focusHandler, true);
		document.addEventListener('mouseover', hoverHandler, false);
		if ( isTouch ) {
			document.addEventListener('touchstart', hoverHandler, false);
		}

	};


	//
	// Public APIs
	//

	return drop;

}));
/**
 * dynamicLinks.js
 * @description Change the href on a link if the user is signed in
 * @version     1.0.0
 * @author      Chris Ferdinandi
 * @param {String} link  Selector for links (must be a valid CSS selector)
 * @param {String} url   The URL to send logged-in users to
 */
var dynamicLinks = function ( link, url ) {

    // Only run if user is logged in
    if ( !mashery_info || !mashery_info.username ) return;

    // Sanity check
    if ( !link || !url ) return;

    // Variables
    var links = document.querySelectorAll( link );

    // Change links to point to new URL
    for ( var i = 0, len = links.length; i < len; i++ ) {
        links[i].href = url;
    }

};
/*! fluidvids.js v2.4.1 | (c) 2014 @toddmotto | https://github.com/toddmotto/fluidvids */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.fluidvids = factory();
  }
})(this, (function () {

  'use strict';

  var fluidvids = {
    selector: ['iframe', 'object'],
    players: ['www.youtube.com', 'player.vimeo.com']
  };

  var css = [
    '.fluidvids {',
      'width: 100%; max-width: 100%; position: relative;',
    '}',
    '.fluidvids-item {',
      'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;',
    '}'
  ].join('');

  var head = document.head || document.getElementsByTagName('head')[0];

  function matches (src) {
    return new RegExp('^(https?:)?\/\/(?:' + fluidvids.players.join('|') + ').*$', 'i').test(src);
  }

  function getRatio (height, width) {
    return ((parseInt(height, 10) / parseInt(width, 10)) * 100) + '%';
  }

  function fluid (elem) {
    if (!matches(elem.src) && !matches(elem.data) || !!elem.getAttribute('data-fluidvids')) return;
    var wrap = document.createElement('div');
    elem.parentNode.insertBefore(wrap, elem);
    elem.className += (elem.className ? ' ' : '') + 'fluidvids-item';
    elem.setAttribute('data-fluidvids', 'loaded');
    wrap.className += 'fluidvids';
    wrap.style.paddingTop = getRatio(elem.height, elem.width);
    wrap.appendChild(elem);
  }

  function addStyles () {
    var div = document.createElement('div');
    div.innerHTML = '<p>x</p><style>' + css + '</style>';
    head.appendChild(div.childNodes[1]);
  }

  fluidvids.render = function () {
    var nodes = document.querySelectorAll(fluidvids.selector.join());
    var i = nodes.length;
    while (i--) {
      fluid(nodes[i]);
    }
  };

  fluidvids.init = function (obj) {
    for (var key in obj) {
      fluidvids[key] = obj[key];
    }
    fluidvids.render();
    addStyles();
  };

  return fluidvids;

}));

/**
 * fullWidth.js
 * @description Make page full-width (no padding or centering)
 * @version 0.0.1
 * @author  Chris Ferdinandi
 */
var fullWidth = function ( hideH1 ) {

	'use strict';

	// Feature test
	if ( !document.querySelector || !window.addEventListener ) return;

	// Variables
	var meta = document.querySelector( '.section-meta' );
	var edit = document.querySelector( '.section-menu .edit' );
	var h1 = document.querySelector( 'h1.first' );

	// Go full width
	document.documentElement.classList.add( 'dom-full-width' );

	// Wrap elements in container class
	if ( meta ) {
		wrapElem( meta, '<div class="container">{{content}}</div>' );
	}
	if ( edit ) {
		wrapElem( edit.parentNode.parentNode, '<div class="container">{{content}}</div>' );
	}
	if ( h1 ) {

		// If enabled, hide the primary h1 element
		if ( hideH1 ) {
			h1.style.display = 'none';
			h1.style.visibility = 'hidden';
		}

		wrapElem( h1, '<div class="container">{{content}}</div>' );

	}

};
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.houdini = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var houdini = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var settings, collapse;

	// Default settings
	var defaults = {
		selectorToggle: '[data-collapse]',
		selectorContent: '.collapse',
		toggleActiveClass: 'active',
		contentActiveClass: 'active',
		initClass: 'js-houdini',
		stopVideo: true,
		callbackOpen: function () {},
		callbackClose: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
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
		var merge = function (obj) {
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
	 * Get the closest matching element up the DOM tree
	 * @param {Element} elem Starting element
	 * @param {String} selector Selector to match against (class, ID, or data attribute)
	 * @return {Boolean|Element} Returns false if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @public
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function ( id ) {

		// Remove leading hash
		if ( id.charAt(0) === '#' ) {
			id = id.substr(1);
		}

		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}

		return '#' + result;

	};

	/**
	 * Stop YouTube, Vimeo, and HTML5 videos from playing when leaving the slide
	 * @private
	 * @param  {Element} content The content container the video is in
	 * @param  {String} activeClass The class asigned to expanded content areas
	 */
	var stopVideos = function ( content, settings ) {

		// Check if stop video enabled
		if ( !settings.stopVideo ) return;

		// Only run if content container is open
		if ( !content.classList.contains( settings.contentActiveClass ) ) return;

		// Check if the video is an iframe or HTML5 video
		var iframe = content.querySelector( 'iframe');
		var video = content.querySelector( 'video' );

		// Stop the video
		if ( iframe ) {
			var iframeSrc = iframe.src;
			iframe.src = iframeSrc;
		}
		if ( video ) {
			video.pause();
		}

	};

	/**
	 * Add focus to content
	 * @private
	 * @param  {node}   content  The content to bring into focus
	 * @param  {object} settings Options
	 */
	var adjustFocus = function ( content, settings ) {

		if ( content.hasAttribute( 'data-houdini-no-focus' ) ) return;

		// If content is closed, remove tabindex
		if ( !content.classList.contains( settings.contentActiveClass ) ) {
			if ( content.hasAttribute( 'data-houdini-focused' ) ) {
				content.removeAttribute( 'tabindex' );
			}
			return;
		}

		// Otherwise, set focus
		content.focus();
		if ( document.activeElement.id !== content.id ) {
			content.setAttribute( 'tabindex', '-1' );
			content.setAttribute( 'data-houdini-focused', true );
			content.focus();
		}

	};

	/**
	 * Open collapsed content
	 * @public
	 * @param  {String} contentID The ID of the content area to close
	 * @param  {Element} toggle The element that toggled the close action
	 * @param  {Object} options
	 */
	houdini.closeContent = function ( contentID, toggle, options ) {

		// Variables
		var localSettings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var content = document.querySelector( escapeCharacters( contentID ) ); // Get content area

		// Sanity check
		if ( !content ) return;

		// Toggle the content
		stopVideos( content, localSettings ); // If content area is closed, stop playing any videos
		if ( toggle ) {
			toggle.classList.remove( localSettings.toggleActiveClass );// Change text on collapse toggle
		}
		content.classList.remove( localSettings.contentActiveClass ); // Collapse or expand content area
		adjustFocus( content, localSettings );

		// Run callbacks after toggling content
		settings.callbackClose( content, toggle );

	};

	/**
	 * Open collapsed content
	 * @public
	 * @param  {String} contentID The ID of the content area to open
	 * @param  {Element} toggle The element that toggled the open action
	 * @param  {Object} options
	 */
	houdini.openContent = function ( contentID, toggle, options ) {

		// Variables
		var localSettings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var content = document.querySelector( escapeCharacters( contentID ) ); // Get content area
		var group = toggle && toggle.hasAttribute( 'data-group') ? document.querySelectorAll('[data-group="' + toggle.getAttribute( 'data-group') + '"]') : [];

		// Sanity check
		if ( !content ) return;

		// If a group, close all other content areas
		forEach(group, (function (item) {
			houdini.closeContent( item.hash, item );
		}));

		// Open the content
		if ( toggle ) {
			toggle.classList.add( localSettings.toggleActiveClass ); // Change text on collapse toggle
		}
		content.classList.add( localSettings.contentActiveClass ); // Collapse or expand content area
		adjustFocus( content, localSettings );
		content.removeAttribute( 'data-houdini-no-focus' );

		// Run callbacks after toggling content
		localSettings.callbackOpen( content, toggle );

	};

	/**
	 * Handle has change event
	 * @private
	 */
	var hashChangeHandler = function (event) {

		// Get hash from URL
		var hash = root.location.hash;

		// If clicked collapse is cached, reset it's ID
		if ( collapse ) {
			collapse.id = collapse.getAttribute( 'data-collapse-id' );
			collapse = null;
		}

		// If there's a URL hash, open the content with matching ID
		if ( !hash ) return;
		var toggle = document.querySelector( settings.selectorToggle + '[href*="' + hash + '"]' );
		houdini.openContent( hash, toggle );

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var clickHandler = function (event) {

		// Don't run if right-click or command/control + click
		if ( event.button !== 0 || event.metaKey || event.ctrlKey ) return;

		// Check if a toggle was clicked
		var toggle = getClosest( event.target, settings.selectorToggle );
		if ( !toggle || !toggle.hash ) return;

		// If the tab is already open, close it
		if ( toggle.classList.contains( settings.toggleActiveClass ) ) {
			event.preventDefault();
			houdini.closeContent( toggle.hash, toggle );
			return;
		}

		// Get the collapse content
		collapse = document.querySelector( toggle.hash );

		// If tab content exists, save the ID as a data attribute and remove it (prevents scroll jump)
		if ( !collapse ) return;
		collapse.setAttribute( 'data-collapse-id', collapse.id );
		collapse.id = '';

		// If no hash change event will happen, fire manually
		if ( toggle.hash === root.location.hash ) {
			event.preventDefault();
			hashChangeHandler();
		}

	};

	/**
	 * Handle content focus events
	 * @private
	 */
	var focusHandler = function (event) {

		// Variables
		collapse = getClosest( event.target, settings.selectorContent );

		// Only run if content exists and isn't open already
		if ( !collapse || collapse.classList.contains( settings.contentActiveClass ) ) return;

		// Save the ID as a data attribute and remove it (prevents scroll jump)
		var hash = collapse.id;
		collapse.setAttribute( 'data-collapse-id', hash );
		collapse.setAttribute( 'data-houdini-no-focus', true );
		collapse.id = '';

		// If no hash change event will happen, fire manually
		if ( hash === root.location.hash.substring(1) ) {
			hashChangeHandler();
			return;
		}

		// Otherwise, update the hash
		root.location.hash = hash;

	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	houdini.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', clickHandler, false);
		document.removeEventListener('focus', focusHandler, true);
		root.removeEventListener('hashchange', hashChangeHandler, false);
		settings = null;
		collapse = null;
	};

	/**
	 * Initialize Houdini
	 * @public
	 * @param {Object} options User settings
	 */
	houdini.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		houdini.destroy();

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Listen for all click events
		document.addEventListener('click', clickHandler, false);
		document.addEventListener('focus', focusHandler, true);
		root.addEventListener('hashchange', hashChangeHandler, false);

		// If URL has a hash, activate hashed content by default
		hashChangeHandler();

	};


	//
	// Public APIs
	//

	return houdini;

}));
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
})(window || this, (function (root) {

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
		toggle.setAttribute( 'data-collapse', true );
		toggle.style.marginLeft = settings.iconMargin;
		toggle.style.marginRight = settings.iconMargin;
		if ( isActive ) { toggle.classList.add( 'active' ); }
		if ( settings.isAccordion ) { toggle.setAttribute( 'data-group', 'docs-subnav' ); }

		// Inject link into DOM
		navlink.parentNode.insertBefore(toggle, location);

	};

	/**
	 * Loop through each subnav element and add expand-and-collapse attributes
	 * @private
	 * @param {NodesList} navs Nav elements
	 */
	var addAttributes = function ( navs ) {
		buoy.forEach(navs, (function (nav, index) {

			// Get subnav
			var subnav = nav.querySelector( 'ul' );

			// If no subnav, move on to the next nav element
			if ( !subnav ) return;

			// Get subnav link
			var navlink = nav.firstChild;

			// Determine if nav is active
			var isActive = nav.classList.contains( 'active' );

			// Remove .active class from parent li
			nav.classList.remove( 'active' );

			// Render the link
			renderLink( navlink, isActive, index );

			// Add classes and ID to subnav
			subnav.classList.add( 'collapse' );
			subnav.id = 'docs-subnav-' + index;
			if ( isActive ) { subnav.classList.add( 'active' ); }

			// If subnav has subnav, run again
			var subSubNavs = subnav.querySelectorAll( 'ul > li' );
			addAttributes( subSubNavs );

		}));
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
		settings = buoy.extend( defaults, options || {} ); // Merge user options with defaults
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

}));
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.modals = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

    'use strict';

    //
    // Variables
    //

    var publicApi = {}; // Object for public APIs
    var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
    var state = 'closed';
    var scrollbarWidth, placeholder, settings;

    // Default settings
    var defaults = {
        selectorToggle: '[data-modal]',
        selectorWindow: '[data-modal-window]',
        selectorClose: '[data-modal-close]',
        modalActiveClass: 'active',
        modalBGClass: 'modal-bg',
        preventBGScroll: false,
        preventBGScrollHtml: true,
        preventBGScrollBody: true,
        backspaceClose: true,
        stopVideo: true,
        callbackOpen: function () {},
        callbackClose: function () {}
    };


    //
    // Methods
    //

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists.
     * @private
     * @author Todd Motto
     * @link   https://github.com/toddmotto/foreach
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function}              callback   Callback function for each iteration
     * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function ( collection, callback, scope ) {
        if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
            for ( var prop in collection ) {
                if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
                    callback.call( scope, collection[prop], prop, collection );
                }
            }
        } else {
            for ( var i = 0, len = collection.length; i < len; i++ ) {
                callback.call( scope, collection[i], i, collection );
            }
        }
    };

    /**
     * Merge two or more objects. Returns a new object.
     * @private
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
        var merge = function (obj) {
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
     * Get the closest matching element up the DOM tree.
     * @private
     * @param  {Element} elem     Starting element
     * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
     * @return {Boolean|Element}  Returns null if not match found
     */
    var getClosest = function ( elem, selector ) {

        // Variables
        var firstChar = selector.charAt(0);
        var attribute, value;

        // If selector is a data attribute, split attribute from value
        if ( firstChar === '[' ) {
            selector = selector.substr(1, selector.length - 2);
            attribute = selector.split( '=' );

            if ( attribute.length > 1 ) {
                value = true;
                attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
            }
        }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {

            // If selector is a class
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            }

            // If selector is an ID
            if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    return elem;
                }
            }

            // If selector is a data attribute
            if ( firstChar === '[' ) {
                if ( elem.hasAttribute( attribute[0] ) ) {
                    if ( value ) {
                        if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
                            return elem;
                        }
                    } else {
                        return elem;
                    }
                }
            }

            // If selector is a tag
            if ( elem.tagName.toLowerCase() === selector ) {
                return elem;
            }

        }

        return null;

    };

    /**
     * Stop YouTube, Vimeo, and HTML5 videos from playing when leaving the slide
     * @private
     * @param  {Element} content The content container the video is in
     * @param  {String} activeClass The class asigned to expanded content areas
     */
    var stopVideos = function ( content, settings ) {

        // Check if stop video enabled
        if ( !settings.stopVideo ) return;

        // Only run if content container was open
        if ( !content.classList.contains( settings.modalActiveClass ) ) return;

        // Check if the video is an iframe or HTML5 video
        var iframe = content.querySelector( 'iframe');
        var video = content.querySelector( 'video' );

        // Stop the video
        if ( iframe ) {
            var iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        }
        if ( video ) {
            video.pause();
        }

    };

    /**
     * Get the width of the scroll bars
     * @private
     */
    var getScrollbarWidth = function () {

        // Setup div
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Force scrollbars
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';

        // Add innerdiv
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;

        // Remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;

    };

    /**
     * Create the modal background and append it to the DOM
     * @private
     */
    var createModalBg = function () {

        // If modal BG already exists, don't create another one
        if ( document.querySelector('[data-modal-bg]') ) return;

        // Define the modal background
        var modalBg = document.createElement('div');
        modalBg.setAttribute('data-modal-bg', true);
        modalBg.classList.add( settings.modalBGClass );

        // Append the modal background to the page
        document.body.appendChild(modalBg);

    };

    /**
     * Remove the modal background from the DOM
     * @private
     */
    var removeModalBg = function () {
        var modalBg = document.querySelector( '[data-modal-bg]' );
        if ( !modalBg ) return;
        document.body.removeChild( modalBg );
    };

    /**
     * Close open modal window
     * @public
     * @param  {Object} options
     * @param  {Event} event
     */
    publicApi.closeModal = function (options) {

        // Selectors and variables
        var localSettings = extend( settings || defaults, options || {} ); // Merge user options with defaults
        var modal = document.querySelector( localSettings.selectorWindow + '.' + localSettings.modalActiveClass ); // Get open modal

        // Sanity check
        if ( !modal ) return;

        // Stop videos from playing
        stopVideos( modal, localSettings );

        // Close the modal
        modal.classList.remove( localSettings.modalActiveClass );

        // Remove the modal background from the DOM
        removeModalBg();

        // Set state to closed
        state = 'closed';

        // Reallow background scrolling
        if ( localSettings.preventBGScroll ) {
            document.documentElement.style.overflowY = '';
            document.body.style.overflowY = '';
            document.body.style.paddingRight = '';
        }

        // Run callbacks after closing a modal
        localSettings.callbackClose( placeholder, modal );

        // Bring focus back to the button that toggles the modal
        if ( placeholder ) {
            placeholder.focus();
            placeholder = null;
        }

    };

    /**
     * Open the target modal window
     * @public
     * @param  {Element} toggle The element that toggled the open modal event
     * @param  {String} modalID ID of the modal to open
     * @param  {Object} options
     * @param  {Event} event
     */
    publicApi.openModal = function (toggle, modalID, options) {

        // Define the modal
        var localSettings = extend( settings || defaults, options || {} );  // Merge user options with defaults
        var modal = document.querySelector(modalID);

        // If a modal is already open, close it first
        if ( state === 'open' ) {
            publicApi.closeModal( localSettings );
        }

        // Save the visitor's spot on the page
        if ( toggle ) {
            placeholder = toggle;
        }

        // Activate the modal
        modal.classList.add( localSettings.modalActiveClass );
        createModalBg();
        state = 'open';

        // Bring modal into focus
        modal.setAttribute( 'tabindex', '-1' );
        modal.focus();

        // Prevent background scrolling
        if ( localSettings.preventBGScroll ) {
            if ( localSettings.preventBGScrollHtml ) {
                document.documentElement.style.overflowY = 'hidden';
            }
            if ( localSettings.preventBGScrollBody ) {
                document.body.style.overflowY = 'hidden';
            }
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }

        localSettings.callbackOpen( toggle, modal ); // Run callbacks after opening a modal

    };

    /**
     * Handle toggle click events
     * @private
     */
    var eventHandler = function (event) {
        var toggle = event.target;
        var open = getClosest(toggle, settings.selectorToggle);
        var close = getClosest(toggle, settings.selectorClose);
        var modal = getClosest(toggle, settings.selectorWindow);
        var key = event.keyCode;

        if ( key && state === 'open' ) {
            if ( key === 27 || ( settings.backspaceClose && ( key === 8 || key === 46 ) ) ) {
                publicApi.closeModal();
            }
        } else if ( toggle ) {
            if ( modal && !close ) {
                return;
            } else if ( open && ( !key || key === 13 ) ) {
                event.preventDefault();
                publicApi.openModal( open, open.getAttribute('data-modal'), settings );
            } else if ( state === 'open' ) {
                event.preventDefault();
                publicApi.closeModal();
            }
        }
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    publicApi.destroy = function () {
        if ( !settings ) return;
        document.removeEventListener('click', eventHandler, false);
        document.removeEventListener('touchstart', eventHandler, false);
        document.removeEventListener('keydown', eventHandler, false);
        document.documentElement.style.overflowY = '';
        document.body.style.overflowY = '';
        document.body.style.paddingRight = '';
        scrollbarWidth = null;
        placeholder = null;
        settings = null;
    };

    /**
     * Initialize Modals
     * @public
     * @param {Object} options User settings
     */
    publicApi.init = function ( options ) {

        // feature test
        if ( !supports ) return;

        // Destroy any existing initializations
        publicApi.destroy();

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        // Get scrollbar width
        scrollbarWidth = getScrollbarWidth();

        // Listen for events
        document.addEventListener('click', eventHandler, false);
        document.addEventListener('touchstart', eventHandler, false);
        document.addEventListener('keydown', eventHandler, false);

    };


    //
    // Public APIs
    //

    return publicApi;

}));
/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript+bash+c+csharp+cpp+ruby+http+java+php+python+sass+scss */
var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map((function(v) { return _.util.clone(v); }));
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, (function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			}));

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type) {
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object') {
						_.languages.DFS(o[i], callback);
					}
					else if (_.util.type(o[i]) === 'Array') {
						_.languages.DFS(o[i], callback, i);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code, pre[class*="lang-"]');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		if (!code || !grammar) {
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					lookbehindLength = 0,
					alias = pattern.alias;

				pattern = pattern.pattern || pattern;

				for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str);

					if (match) {
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index - 1 + lookbehindLength,
							match = match[0].slice(lookbehindLength),
							len = match.length,
							to = from + len,
							before = str.slice(0, from + 1),
							after = str.slice(to + 1);

						var args = [i, 1];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias) {
	this.type = type;
	this.content = content;
	this.alias = alias;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map((function(element) {
			return Token.stringify(element, language, o);
		})).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = '';

	for (var name in env.attributes) {
		attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
	}

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', (function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}), false);

	return _self.Prism;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}
;
Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?[^\s>\/=.]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', (function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
}));

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
};
Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true
	}
});

Prism.languages.insertBefore('javascript', 'class-name', {
	'template-string': {
		pattern: /`(?:\\`|\\?[^`])*`/,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;
(function(Prism) {
	var insideString = {
		variable: [
			// Arithmetic Environment
			{
				pattern: /\$?\(\([\w\W]+?\)\)/,
				inside: {
					// If there is a $ sign at the beginning highlight $(( and )) as variable
					variable: [{
							pattern: /(^\$\(\([\w\W]+)\)\)/,
							lookbehind: true
						},
						/^\$\(\(/,
					],
					number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
					// Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
					operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
					// If there is no $ sign at the beginning highlight (( and )) as punctuation
					punctuation: /\(\(?|\)\)?|,|;/
				}
			},
			// Command Substitution
			{
				pattern: /\$\([^)]+\)|`[^`]+`/,
				inside: {
					variable: /^\$\(|^`|\)$|`$/
				}
			},
			/\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i
		],
	};

	Prism.languages.bash = {
		'shebang': {
			pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
			alias: 'important'
		},
		'comment': {
			pattern: /(^|[^"{\\])#.*/,
			lookbehind: true
		},
		'string': [
			//Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
			{
				pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
				lookbehind: true,
				inside: insideString
			},
			{
				pattern: /("|')(?:\\?[\s\S])*?\1/g,
				inside: insideString
			}
		],
		'variable': insideString.variable,
		// Originally based on http://ss64.com/bash/
		'function': {
			pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
			lookbehind: true
		},
		'keyword': {
			pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
			lookbehind: true
		},
		'boolean': {
			pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
			lookbehind: true
		},
		'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
		'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
	};

	var inside = insideString.variable[1].inside;
	inside['function'] = Prism.languages.bash['function'];
	inside.keyword = Prism.languages.bash.keyword;
	inside.boolean = Prism.languages.bash.boolean;
	inside.operator = Prism.languages.bash.operator;
	inside.punctuation = Prism.languages.bash.punctuation;
})(Prism);
Prism.languages.c = Prism.languages.extend('clike', {
	'keyword': /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
	'operator': /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
});

Prism.languages.insertBefore('c', 'string', {
	'macro': {
		// allow for multiline macro definitions
		// spaces after the # character compile fine with gcc
		pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
		lookbehind: true,
		alias: 'property',
		inside: {
			// highlight the path of the include statement as a string
			'string': {
				pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,
				lookbehind: true
			},
			// highlight macro directives as keywords
			'directive': {
				pattern: /(#\s*)\b(define|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
				lookbehind: true,
				alias: 'keyword'
			}
		}
	},
	// highlight predefined macros as constants
	'constant': /\b(__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|stdin|stdout|stderr)\b/
});

delete Prism.languages.c['class-name'];
delete Prism.languages.c['boolean'];

Prism.languages.csharp = Prism.languages.extend('clike', {
	'keyword': /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/,
	'string': [
		/@("|')(\1\1|\\\1|\\?(?!\1)[\s\S])*\1/,
		/("|')(\\?.)*?\1/
	],
	'number': /\b-?(0x[\da-f]+|\d*\.?\d+f?)\b/i
});

Prism.languages.insertBefore('csharp', 'keyword', {
	'preprocessor': {
		pattern: /(^\s*)#.*/m,
		lookbehind: true,
		alias: 'property',
		inside: {
			// highlight preprocessor directives as keywords
			'directive': {
				pattern: /(\s*#)\b(define|elif|else|endif|endregion|error|if|line|pragma|region|undef|warning)\b/,
				lookbehind: true,
				alias: 'keyword'
			}
		}
	}
});

Prism.languages.cpp = Prism.languages.extend('c', {
	'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
	'boolean': /\b(true|false)\b/,
	'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
});

Prism.languages.insertBefore('cpp', 'keyword', {
	'class-name': {
		pattern: /(class\s+)[a-z0-9_]+/i,
		lookbehind: true
	}
});
/**
 * Original by Samuel Flores
 *
 * Adds the following new token classes:
 * 		constant, builtin, variable, symbol, regex
 */
(function(Prism) {
	Prism.languages.ruby = Prism.languages.extend('clike', {
		'comment': /#(?!\{[^\r\n]*?\}).*/,
		'keyword': /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
	});

	var interpolation = {
		pattern: /#\{[^}]+\}/,
		inside: {
			'delimiter': {
				pattern: /^#\{|\}$/,
				alias: 'tag'
			},
			rest: Prism.util.clone(Prism.languages.ruby)
		}
	};

	Prism.languages.insertBefore('ruby', 'keyword', {
		'regex': [
			{
				pattern: /%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				// Here we need to specifically allow interpolation
				pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
				inside: {
					'interpolation': interpolation
				}
			},
			{
				pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
				lookbehind: true
			}
		],
		'variable': /[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,
		'symbol': /:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/
	});

	Prism.languages.insertBefore('ruby', 'number', {
		'builtin': /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
		'constant': /\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/
	});

	Prism.languages.ruby.string = [
		{
			pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
			inside: {
				'interpolation': interpolation
			}
		},
		{
			pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
			inside: {
				'interpolation': interpolation
			}
		},
		{
			// Here we need to specifically allow interpolation
			pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
			inside: {
				'interpolation': interpolation
			}
		},
		{
			pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
			inside: {
				'interpolation': interpolation
			}
		},
		{
			pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
			inside: {
				'interpolation': interpolation
			}
		},
		{
			pattern: /("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,
			inside: {
				'interpolation': interpolation
			}
		}
	];
}(Prism));
Prism.languages.http = {
	'request-line': {
		pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
		inside: {
			// HTTP Verb
			property: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,
			// Path or query argument
			'attr-name': /:\w+/
		}
	},
	'response-status': {
		pattern: /^HTTP\/1.[01] [0-9]+.*/m,
		inside: {
			// Status, e.g. 200 OK
			property: {
                pattern: /(^HTTP\/1.[01] )[0-9]+.*/i,
                lookbehind: true
            }
		}
	},
	// HTTP header name
	'header-name': {
        pattern: /^[\w-]+:(?=.)/m,
        alias: 'keyword'
    }
};

// Create a mapping of Content-Type headers to language definitions
var httpLanguages = {
	'application/json': Prism.languages.javascript,
	'application/xml': Prism.languages.markup,
	'text/xml': Prism.languages.markup,
	'text/html': Prism.languages.markup
};

// Insert each content type parser that has its associated language
// currently loaded.
for (var contentType in httpLanguages) {
	if (httpLanguages[contentType]) {
		var options = {};
		options[contentType] = {
			pattern: new RegExp('(content-type:\\s*' + contentType + '[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*', 'i'),
			lookbehind: true,
			inside: {
				rest: httpLanguages[contentType]
			}
		};
		Prism.languages.insertBefore('http', 'header-name', options);
	}
}
;
Prism.languages.java = Prism.languages.extend('clike', {
	'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
	'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i,
	'operator': {
		pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
		lookbehind: true
	}
});
/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 *
 * Supports the following:
 * 		- Extends clike syntax
 * 		- Support for PHP 5.3+ (namespaces, traits, generators, etc)
 * 		- Smarter constant and function matching
 *
 * Adds the following new token classes:
 * 		constant, delimiter, variable, function, package
 */

Prism.languages.php = Prism.languages.extend('clike', {
	'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
	'constant': /\b[A-Z0-9_]{2,}\b/,
	'comment': {
		pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
		lookbehind: true
	}
});

// Shell-like comments are matched after strings, because they are less
// common than strings containing hashes...
Prism.languages.insertBefore('php', 'class-name', {
	'shell-comment': {
		pattern: /(^|[^\\])#.*/,
		lookbehind: true,
		alias: 'comment'
	}
});

Prism.languages.insertBefore('php', 'keyword', {
	'delimiter': /\?>|<\?(?:php)?/i,
	'variable': /\$\w+\b/i,
	'package': {
		pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
		lookbehind: true,
		inside: {
			punctuation: /\\/
		}
	}
});

// Must be defined after the function pattern
Prism.languages.insertBefore('php', 'operator', {
	'property': {
		pattern: /(->)[\w]+/,
		lookbehind: true
	}
});

// Add HTML support of the markup language exists
if (Prism.languages.markup) {

	// Tokenize all inline PHP blocks that are wrapped in <?php ?>
	// This allows for easy PHP + markup highlighting
	Prism.hooks.add('before-highlight', (function(env) {
		if (env.language !== 'php') {
			return;
		}

		env.tokenStack = [];

		env.backupCode = env.code;
		env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig, (function(match) {
			env.tokenStack.push(match);

			return '{{{PHP' + env.tokenStack.length + '}}}';
		}));
	}));

	// Restore env.code for other plugins (e.g. line-numbers)
	Prism.hooks.add('before-insert', (function(env) {
		if (env.language === 'php') {
			env.code = env.backupCode;
			delete env.backupCode;
		}
	}));

	// Re-insert the tokens after highlighting
	Prism.hooks.add('after-highlight', (function(env) {
		if (env.language !== 'php') {
			return;
		}

		for (var i = 0, t; t = env.tokenStack[i]; i++) {
			// The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
			env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', Prism.highlight(t, env.grammar, 'php').replace(/\$/g, '$$$$'));
		}

		env.element.innerHTML = env.highlightedCode;
	}));

	// Wrap tokens in classes that are missing them
	Prism.hooks.add('wrap', (function(env) {
		if (env.language === 'php' && env.type === 'markup') {
			env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
		}
	}));

	// Add the rules before all others
	Prism.languages.insertBefore('php', 'comment', {
		'markup': {
			pattern: /<[^?]\/?(.*?)>/,
			inside: Prism.languages.markup
		},
		'php': /\{\{\{PHP[0-9]+\}\}\}/
	});
}
;
Prism.languages.python= {
	'comment': {
		pattern: /(^|[^\\])#.*/,
		lookbehind: true
	},
	'string': /"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(?:\\?.)*?\1/,
	'function' : {
		pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
		lookbehind: true
	},
	'class-name': {
		pattern: /(\bclass\s+)[a-z0-9_]+/i,
		lookbehind: true
	},
	'keyword' : /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
	'boolean' : /\b(?:True|False)\b/,
	'number' : /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
	'operator' : /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
	'punctuation' : /[{}[\];(),.:]/
};

(function(Prism) {
	Prism.languages.sass = Prism.languages.extend('css', {
		// Sass comments don't need to be closed, only indented
		'comment': {
			pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
			lookbehind: true
		}
	});

	Prism.languages.insertBefore('sass', 'atrule', {
		// We want to consume the whole line
		'atrule-line': {
			// Includes support for = and + shortcuts
			pattern: /^(?:[ \t]*)[@+=].+/m,
			inside: {
				'atrule': /(?:@[\w-]+|[+=])/m
			}
		}
	});
	delete Prism.languages.sass.atrule;


	var variable = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i;
	var operator = [
		/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/,
		{
			pattern: /(\s+)-(?=\s)/,
			lookbehind: true
		}
	];

	Prism.languages.insertBefore('sass', 'property', {
		// We want to consume the whole line
		'variable-line': {
			pattern: /^[ \t]*\$.+/m,
			inside: {
				'punctuation': /:/,
				'variable': variable,
				'operator': operator
			}
		},
		// We want to consume the whole line
		'property-line': {
			pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
			inside: {
				'property': [
					/[^:\s]+(?=\s*:)/,
					{
						pattern: /(:)[^:\s]+/,
						lookbehind: true
					}
				],
				'punctuation': /:/,
				'variable': variable,
				'operator': operator,
				'important': Prism.languages.sass.important
			}
		}
	});
	delete Prism.languages.sass.property;
	delete Prism.languages.sass.important;

	// Now that whole lines for other patterns are consumed,
	// what's left should be selectors
	delete Prism.languages.sass.selector;
	Prism.languages.insertBefore('sass', 'punctuation', {
		'selector': {
			pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
			lookbehind: true
		}
	});

}(Prism));
Prism.languages.scss = Prism.languages.extend('css', {
	'comment': {
		pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
		lookbehind: true
	},
	'atrule': {
		pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	// url, compassified
	'url': /(?:[-a-z]+-)*url(?=\()/i,
	// CSS selector regex is not appropriate for Sass
	// since there can be lot more things (var, @ directive, nesting..)
	// a selector must start at the end of a property or after a brace (end of other rules or nesting)
	// it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
	// the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
	// can "pass" as a selector- e.g: proper#{$erty})
	// this one was hard to do, so please be careful if you edit this one :)
	'selector': {
		// Initial look-ahead is used to prevent matching of blank selectors
		pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
		inside: {
			'placeholder': /%[-_\w]+/
		}
	}
});

Prism.languages.insertBefore('scss', 'atrule', {
	'keyword': [
		/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
		{
			pattern: /( +)(?:from|through)(?= )/,
			lookbehind: true
		}
	]
});

Prism.languages.insertBefore('scss', 'property', {
	// var and interpolated vars
	'variable': /\$[-_\w]+|#\{\$[-_\w]+\}/
});

Prism.languages.insertBefore('scss', 'function', {
	'placeholder': {
		pattern: /%[-_\w]+/,
		alias: 'selector'
	},
	'statement': /\B!(?:default|optional)\b/i,
	'boolean': /\b(?:true|false)\b/,
	'null': /\bnull\b/,
	'operator': {
		pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
		lookbehind: true
	}
});

Prism.languages.scss['atrule'].inside.rest = Prism.util.clone(Prism.languages.scss);

/**
 * removeMasheryApiSelection.js
 * @description Overrides and removes MasheryApiSelection.js, which is causing some unintended behaviors
 * @version  1.0.0
 * @author Chris Ferdinandi
 */

;(function (window, document, undefined) {

	'use strict';

	// Variables
	var scripts = document.getElementsByTagName('script'); // Get all scripots
	var defs = document.getElementsByTagName('dd'); // Get all <dd> elements

	// Remove MasheryApiSelection.js from DOM
	buoy.forEach(scripts, (function (script) {
		if ( !script || !script.src || !/MasheryApiSelection.js/.test( script.src ) ) return;
		script.parentNode.removeChild(script);
	}));

	// Reset display of <dd> to block and remove click event that hides it
	buoy.forEach(defs, (function (def, index) {

		// Get the <dd> that MasheryApiSelection hid
		if ( def.style.display === 'none' ) {

			// Grab the checkbox that's toggling it and clone it
			var toggle = defs[index - 1];
			var toggleNew = toggle.cloneNode(true);
			var parent = toggle.parentNode;

			// Reset visibility on the <dd> and replace the toggle with the clone
			// (Clones do not carry over click events)
			def.style.display = '';
			parent.insertBefore(toggleNew, toggle);
			parent.removeChild(toggle);

		}

	}));

})(window, document);
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
})(window || this, (function (root) {

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

}));
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.rightHeight = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var rightHeight = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings, containers, eventTimeout;

	// Default settings
	var defaults = {
		selector: '[data-right-height]',
		selectorContent: '[data-right-height-content]',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists.
	 * @private
	 * @author Todd Motto
	 * @link   https://github.com/toddmotto/foreach
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function}              callback   Callback function for each iteration
	 * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
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
		var merge = function (obj) {
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
	 * Wait until document is ready to run method
	 * @private
	 * @param  {Function} fn Method to run
	 */
	var ready = function ( fn ) {

		// Sanity check
		if ( typeof fn !== 'function' ) return;

		// If document is already loaded, run method
		if ( document.readyState === 'interactive'  ) {
			return fn();
		}

		// Otherwise, wait until document is loaded
		document.addEventListener( 'DOMContentLoaded', fn, false );

	};


	/**
	 * Get an element's distance from the top of the Document.
	 * @private
	 * @param  {Node} elem The element
	 * @return {Number}    Distance from the top in pixels
	 */
	var getOffsetTop = function ( elem ) {
		var location = 0;
		if (elem.offsetParent) {
			do {
				location += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}
		return location >= 0 ? location : 0;
	};

	/**
	 * Check if a group of content areas are stacked
	 * @private
	 * @param  {NodeList} contents A collection of content areas to compare
	 * @return {Boolean} Returns true if elements are stacked
	 */
	var checkIfStacked = function ( contents ) {

		// Selectors and variables
		var contentFirst = contents.item(0);
		var contentSecond = contents.item(1);

		// Determine if content containers are stacked
		if ( contentFirst && contentSecond ) {
			if ( getOffsetTop(contentFirst) - getOffsetTop(contentSecond) === 0 ) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}

	};

	/**
	 * Reset the content height to 'auto'
	 * @private
	 * @param  {Element} content The content area to set to height: auto
	 */
	var resetHeight = function ( content ) {
		content.style.height = '';
		content.style.minHeight = '';
	};

	/**
	 * Get the natural height of each content area, and
	 * record the tallest height to set for all other elements.
	 * @private
	 * @param  {Element} content A content area
	 * @param  {Number} height The current tallest height
	 * @return {Number} The updated tallest height
	 */
	var getHeight = function ( content, height ) {
		if ( content.offsetHeight > height ) {
			height = content.offsetHeight;
		}
		return height;
	};

	/**
	 * Set the height of each content area
	 * @private
	 * @param {Element} content The content area to set a height for
	 * @param {Number} height The height of the tallest content area
	 */
	var setHeight = function ( content, height ) {
		content.style.height = height + 'px';
	};

	/**
	 * Get all content areas within a group
	 * @public
	 * @param  {Element} container The wrapper that contains a set of content areas
	 * @param  {Object} options
	 */
	rightHeight.adjustContainerHeight = function ( container, options ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var contents = container.querySelectorAll( settings.selectorContent );
		var isStacked = checkIfStacked(contents);
		var height = '0';

		// Reset each content area to its natural height
		forEach(contents, (function (content) {
			resetHeight( content );
		}));

		// If content areas are not stacked, give them equal heights
		if ( !isStacked ) {
			forEach(contents, (function (content) {
				height = getHeight( content, height );
			}));
			forEach(contents, (function (content) {
				setHeight( content, height );
			}));
		}

		settings.callback( container ); // Run callbacks after adjust content

	};

	/**
	 * For each group of content, adjust the content area heights
	 * @private
	 * @param  {NodeList} containers A collection of content wrappers
	 * @param  {Object}   settings
	 */
	var runRightHeight = function ( containers, settings ) {
		forEach(containers, (function (container) {
			rightHeight.adjustContainerHeight( container, settings );
		}));
	};

	/**
	 * On window resize, only run 'runRightHeight' at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {NodeList} containers A collection of content wrappers
	 * @param  {Object} settings
	 */
	var eventThrottler = function () {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout((function() {
				eventTimeout = null;
				runRightHeight( containers, settings );
			}), 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	rightHeight.destroy = function () {

		if (!settings) return;

		// Reset content and remove event listeners
		forEach(containers, (function (container) {
			var contents = container.querySelectorAll( settings.selectorContent );
			forEach(contents, (function (content) {
				resetHeight( content );
			}));
		}));
		root.removeEventListener('resize', eventThrottler, false);

		// Reset variables
		settings = null;
		containers = null;
		eventTimeout = null;

	};

	/**
	 * Initialize Right Height
	 * @public
	 * @param {Object} options User settings
	 */
	rightHeight.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		rightHeight.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		containers = document.querySelectorAll( settings.selector ); // Groups of content

		// Events and listeners
		ready((function() {
			runRightHeight( containers, options ); // Run Right Height on load
		}));
		root.addEventListener('resize', eventThrottler, false); // Run Right Height on window resize

	};


	//
	// Public APIs
	//

	return rightHeight;

}));
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight, animationInterval;

	// Default settings
	var defaults = {
		selector: '[data-scroll]',
		selectorHeader: '[data-scroll-header]',
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
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
		var merge = function (obj) {
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
	 * Get the height of an element.
	 * @private
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function ( elem ) {
		return Math.max( elem.scrollHeight, elem.offsetHeight, elem.clientHeight );
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @public
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	smoothScroll.escapeCharacters = function ( id ) {

		// Remove leading hash
		if ( id.charAt(0) === '#' ) {
			id = id.substr(1);
		}

		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}

		return '#' + result;

	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function ( type, time ) {
		var pattern;
		if ( type === 'easeInQuad' ) pattern = time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuad' ) pattern = time * (2 - time); // decelerating to zero velocity
		if ( type === 'easeInOutQuad' ) pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInCubic' ) pattern = time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutCubic' ) pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if ( type === 'easeInOutCubic' ) pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuart' ) pattern = time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuart' ) pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuart' ) pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if ( type === 'easeInQuint' ) pattern = time * time * time * time * time; // accelerating from zero velocity
		if ( type === 'easeOutQuint' ) pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if ( type === 'easeInOutQuint' ) pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function ( anchor, headerHeight, offset ) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = Math.max(location - headerHeight - offset, 0);
		return Math.min(location, getDocumentHeight() - getViewportHeight());
	};

	/**
	 * Determine the viewport's height
	 * @private
	 * @returns {Number}
	 */
	var getViewportHeight = function() {
        	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
			root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
			root.document.body.clientHeight, root.document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse( options );
	};

	/**
	 * Update the URL
	 * @private
	 * @param {Element} anchor The element to scroll to
	 * @param {Boolean} url Whether or not to update the URL history
	 */
	var updateUrl = function ( anchor, url ) {
		if ( root.history.pushState && (url || url === 'true') && root.location.protocol !== 'file:' ) {
			root.history.pushState( null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join('') );
		}
	};

	var getHeaderHeight = function ( header ) {
		return header === null ? 0 : ( getHeight( header ) + header.offsetTop );
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} anchor The element to scroll to
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function ( anchor, toggle, options ) {

		// Options and overrides
		var overrides = getDataOptions( toggle ? toggle.getAttribute('data-options') : null );
		var animateSettings = extend( settings || defaults, options || {}, overrides ); // Merge user options with defaults

		// Selectors and variables
		var isNum = Object.prototype.toString.call( anchor ) === '[object Number]' ? true : false;
		var hash = isNum ? null : smoothScroll.escapeCharacters( anchor );
		var anchorElem = isNum ? null : ( hash === '#' ? root.document.documentElement : root.document.querySelector( hash ) );
		if ( !isNum && !anchorElem ) return;
		var startLocation = root.pageYOffset; // Current location on the page
		if ( !fixedHeader ) { fixedHeader = root.document.querySelector( animateSettings.selectorHeader ); }  // Get the fixed header if not already set
		if ( !headerHeight ) { headerHeight = getHeaderHeight( fixedHeader ); } // Get the height of a fixed header if one exists and not already set
		var endLocation = isNum ? anchor : getEndLocation( anchorElem, headerHeight, parseInt(animateSettings.offset, 10) ); // Location to scroll to
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		if ( !isNum ) {
			updateUrl( anchor, animateSettings.updateURL );
		}

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function ( position, endLocation, animationInterval ) {
			var currentLocation = root.pageYOffset;
			if ( position == endLocation || currentLocation == endLocation || ( (root.innerHeight + currentLocation) >=

				documentHeight ) ) {
				clearInterval(animationInterval);

				// If scroll target is an anchor, bring it into focus
				if ( !isNum ) {
					anchorElem.focus();
					if ( document.activeElement.id !== anchorElem.id ) {
						anchorElem.setAttribute( 'tabindex', '-1' );
						anchorElem.focus();
						anchorElem.style.outline = 'none';
					}
				}
				animateSettings.callback( anchor, toggle ); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = ( timeLapsed / parseInt(animateSettings.speed, 10) );
			percentage = ( percentage > 1 ) ? 1 : percentage;
			position = startLocation + ( distance * easingPattern(animateSettings.easing, percentage) );
			root.scrollTo( 0, Math.floor(position) );
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			clearInterval(animationInterval);
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if ( root.pageYOffset === 0 ) {
			root.scrollTo( 0, 0 );
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * If smooth scroll element clicked, animate scroll
	 * @private
	 */
	var eventHandler = function (event) {

		// Don't run if right-click or command/control + click
		if ( event.button !== 0 || event.metaKey || event.ctrlKey ) return;

		// If a smooth scroll link, animate it
		var toggle = getClosest( event.target, settings.selector );
		if ( toggle && toggle.tagName.toLowerCase() === 'a' ) {

			// Check that link is an anchor and points to current page
			if ( toggle.hostname !== root.location.hostname || toggle.pathname !== root.location.pathname || !/#/.test(toggle.href) ) return;

			event.preventDefault(); // Prevent default click event
			smoothScroll.animateScroll( toggle.hash, toggle, settings); // Animate scroll

		}

	};

	/**
	 * On window scroll and resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {Object} settings
	 */
	var eventThrottler = function (event) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout((function() {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight( fixedHeader ); // Get the height of a fixed header if one exists
			}), 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if ( !settings ) return;

		// Remove event listeners
		root.document.removeEventListener( 'click', eventHandler, false );
		root.removeEventListener( 'resize', eventThrottler, false );

		// Reset varaibles
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
		animationInterval = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		fixedHeader = root.document.querySelector( settings.selectorHeader ); // Get the fixed header
		headerHeight = getHeaderHeight( fixedHeader );

		// When a toggle is clicked, run the click handler
		root.document.addEventListener('click', eventHandler, false );
		if ( fixedHeader ) { root.addEventListener( 'resize', eventThrottler, false ); }

	};


	//
	// Public APIs
	//

	return smoothScroll;

}));
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
})(window || this, (function (root) {

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
			eventTimeout = setTimeout((function() {
				eventTimeout = null;
				stickyFooter.setContentHeight( content, footer, settings );
			}), 66);
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

}));
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.tabby = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var tabby = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_') && 'onhashchange' in root; // Feature test
	var settings, tab;

	// Default settings
	var defaults = {
		selectorToggle: '[data-tab]',
		selectorToggleGroup: '[data-tabs]',
		selectorContent: '[data-tabs-pane]',
		selectorContentGroup: '[data-tabs-content]',
		toggleActiveClass: 'active',
		contentActiveClass: 'active',
		initClass: 'js-tabby',
		stopVideo: true,
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
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
		var merge = function (obj) {
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
	 * Get the closest matching element up the DOM tree
	 * @param {Element} elem Starting element
	 * @param {String} selector Selector to match against (class, ID, or data attribute)
	 * @return {Boolean|Element} Returns false if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @public
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function ( id ) {

			// Remove leading hash
			if ( id.charAt(0) === '#' ) {
				id = id.substr(1);
			}

			var string = String(id);
			var length = string.length;
			var index = -1;
			var codeUnit;
			var result = '';
			var firstCodeUnit = string.charCodeAt(0);
			while (++index < length) {
				codeUnit = string.charCodeAt(index);
				// Note: there’s no need to special-case astral symbols, surrogate
				// pairs, or lone surrogates.

				// If the character is NULL (U+0000), then throw an
				// `InvalidCharacterError` exception and terminate these steps.
				if (codeUnit === 0x0000) {
					throw new InvalidCharacterError(
						'Invalid character: the input contains U+0000.'
					);
				}

				if (
					// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
					// U+007F, […]
					(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
					// If the character is the first character and is in the range [0-9]
					// (U+0030 to U+0039), […]
					(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
					// If the character is the second character and is in the range [0-9]
					// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
					(
						index === 1 &&
						codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
						firstCodeUnit === 0x002D
					)
				) {
					// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
					result += '\\' + codeUnit.toString(16) + ' ';
					continue;
				}

				// If the character is not handled by one of the above rules and is
				// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
				// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
				// U+005A), or [a-z] (U+0061 to U+007A), […]
				if (
					codeUnit >= 0x0080 ||
					codeUnit === 0x002D ||
					codeUnit === 0x005F ||
					codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
					codeUnit >= 0x0041 && codeUnit <= 0x005A ||
					codeUnit >= 0x0061 && codeUnit <= 0x007A
				) {
					// the character itself
					result += string.charAt(index);
					continue;
				}

				// Otherwise, the escaped character.
				// http://dev.w3.org/csswg/cssom/#escape-a-character
				result += '\\' + string.charAt(index);

			}

			return '#' + result;

		};

	/**
	 * Stop YouTube, Vimeo, and HTML5 videos from playing when leaving the slide
	 * @private
	 * @param  {Element} content The content container the video is in
	 * @param  {String} activeClass The class asigned to expanded content areas
	 */
	var stopVideos = function ( content, settings ) {

		// Check if stop video enabled
		if ( !settings.stopVideo ) return;

		// Only run if content container is closed
		if ( content.classList.contains( settings.contentActiveClass ) ) return;

		// Check if the video is an iframe or HTML5 video
		var iframe = content.querySelector( 'iframe');
		var video = content.querySelector( 'video' );

		// Stop the video
		if ( iframe ) {
			var iframeSrc = iframe.src;
			iframe.src = iframeSrc;
		}
		if ( video ) {
			video.pause();
		}

	};

	/**
	 * Add focus to tab
	 * @private
	 * @param  {node}   tab      The content to bring into focus
	 * @param  {object} settings Options
	 */
	var adjustFocus = function ( tab, settings ) {

		if ( tab.hasAttribute( 'data-tab-no-focus' ) ) return;

		// If tab is closed, remove tabindex
		if ( !tab.classList.contains( settings.contentActiveClass ) ) {
			if ( tab.hasAttribute( 'data-tab-focused' ) ) {
				tab.removeAttribute( 'tabindex' );
			}
			return;
		}

		// Otherwise, set focus
		tab.focus();
		if ( document.activeElement.id !== tab.id ) {
			tab.setAttribute( 'tabindex', '-1' );
			tab.setAttribute( 'data-tab-focused', true );
			tab.focus();
		}

	};

	/**
	 * Toggle tab toggle active state
	 * @private
	 * @param  {Node}   toggle   The toggle element
	 * @param  {Object} settings
	 */
	var toggleToggles = function ( toggle, settings ) {

		// Variables
		var toggleGroup = getClosest( toggle, settings.selectorToggleGroup ); // The parent for the toggle group
		if ( !toggleGroup ) return;
		var toggles = toggleGroup.querySelectorAll( settings.selectorToggle ); // The toggles in the group
		var toggleList;

		// Show or hide each toggle
		// @todo Start here
		forEach(toggles, (function (item) {

			// If this is the selected toggle, activate it
			if ( item.hash === toggle.hash ) {

				// Add active class
				item.classList.add( settings.toggleActiveClass );

				// If toggle is a list item, activate <li> element, too
				toggleList = getClosest( item, 'li' );
				if ( toggleList ) {
					toggleList.classList.add( settings.toggleActiveClass );
				}

				return;

			}

			// Otherwise, deactivate it
			item.classList.remove( settings.toggleActiveClass );
			toggleList = getClosest( item, 'li' );
			if ( toggleList ) {
				toggleList.classList.remove( settings.toggleActiveClass );
			}

		}));

	};

	/**
	 * Toggle tab active state
	 * @private
	 * @param  {String} tabID    The ID of the tab to activate
	 * @param  {Object} settings
	 */
	var toggleTabs = function ( tabID, settings ) {

		// Variables
		var tab = document.querySelector( escapeCharacters( tabID ) ); // The selected tab
		if ( !tab ) return;
		var tabGroup = getClosest( tab, settings.selectorContentGroup ); // The parent for the tab group
		if ( !tabGroup ) return;
		var tabs = tabGroup.querySelectorAll( settings.selectorContent ); // The tabs in the group

		// Show or hide each tab
		forEach(tabs, (function (tab) {

			// If this is the selected tab, show it
			if ( tab.id === tabID.substring(1) ) {
				tab.classList.add( settings.contentActiveClass );
				adjustFocus( tab, settings );
				return;
			}

			// Otherwise, hide it
			tab.classList.remove( settings.contentActiveClass );
			stopVideos( tab, settings );
			adjustFocus( tab, settings );

		}));

	};

	/**
	 * Show a tab and hide all others
	 * @public
	 * @param  {Element} toggle The element that toggled the show tab event
	 * @param  {String}  tabID The ID of the tab to show
	 * @param  {Object}  options
	 */
	tabby.toggleTab = function ( tabID, toggle, options ) {

		// Selectors and variables
		var localSettings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var tabs = document.querySelectorAll( escapeCharacters( tabID ) ); // Get tab content

		// Toggle visibility of the toggles and tabs
		toggleTabs( tabID, localSettings );
		if ( toggle ) {
			toggleToggles(toggle, localSettings);
		}

		// Run callbacks after toggling tab
		localSettings.callback( tabs, toggle );

	};

	/**
	 * Handle has change event
	 * @private
	 */
	var hashChangeHandler = function (event) {

		// Get hash from URL
		var hash = root.location.hash;

		// If clicked tab is cached, reset it's ID
		if ( tab ) {
			tab.id = tab.getAttribute( 'data-tab-id' );
			tab = null;
		}

		// If there's a URL hash, activate tab with matching ID
		if ( !hash ) return;
		var toggle = document.querySelector( settings.selectorToggle + '[href*="' + hash + '"]' );
		tabby.toggleTab( hash, toggle );

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var clickHandler = function (event) {

		// Don't run if right-click or command/control + click
		if ( event.button !== 0 || event.metaKey || event.ctrlKey ) return;

		// Check if event target is a tab toggle
		var toggle = getClosest( event.target, settings.selectorToggle );
		if ( !toggle || !toggle.hash ) return;

		// Don't run if toggle points to currently open tab
		if ( toggle.hash === root.location.hash ) {
			event.preventDefault();
			return;
		}

		// Get the tab content
		tab = document.querySelector( toggle.hash );

		// If tab content exists, save the ID as a data attribute and remove it (prevents scroll jump)
		if ( !tab ) return;
		tab.setAttribute( 'data-tab-id', tab.id );
		tab.id = '';

	};

	/**
	 * Handle content focus events
	 * @private
	 */
	var focusHandler = function (event) {

		// Only run if the focused content is in a tab
		tab = getClosest( event.target, settings.selectorContent );
		if ( !tab ) return;

		// Don't run if the content area is already open
		if ( tab.classList.contains( settings.contentActiveClass ) ) return;

		// Store tab ID to variable and remove it from the tab
		var hash = tab.id;
		tab.setAttribute( 'data-tab-id', hash );
		tab.setAttribute( 'data-tab-no-focus', true );
		tab.id = '';

		// Change the hash
		location.hash = hash;

	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	tabby.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', clickHandler, false);
		document.removeEventListener('focus', focusHandler, true);
		root.removeEventListener('hashchange', hashChangeHandler, false);
		settings = null;
		tab = null;
	};

	/**
	 * Initialize Tabby
	 * @public
	 * @param {Object} options User settings
	 */
	tabby.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		tabby.destroy();

		// Merge user options with defaults
		settings = extend( defaults, options || {} );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Listen for all click events
		document.addEventListener('click', clickHandler, false);
		document.addEventListener('focus', focusHandler, true);
		root.addEventListener('hashchange', hashChangeHandler, false);

		// If URL has a hash, activate hashed tab by default
		hashChangeHandler();

	};


	//
	// Public APIs
	//

	return tabby;

}));
/**
 * toggleIODocs.js
 * @description Dynamically togle IO-Docs selection using a URK query selector
 * @version     2.0.0
 * @author      Chris Ferdinandi
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('toggleIODocs', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.toggleIODocs = factory(root);
	}
})(window || this, (function (root) {

	'use strict';


	//
	// Variables
	//

	var toggleIODocs = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, select;

	// Default settings
	var defaults = {
		initClass: 'js-toggle-io-docs',
		callback: function () {},
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
	 * Find the selected method in the DOM
	 * @param  {string} name The method to scroll to
	 * @return {node}        The method in the DOM
	 */
	var getMethod = function ( name ) {
		if ( !name ) return;
		var methods = document.querySelectorAll( '.method .name' );
		for ( var i = 0, len = methods.length; i < len; i++ ) {
			if ( methods[i].innerHTML.toLowerCase().trim() === decodeURI( name ).toLowerCase() ) {
				return methods[i].parentNode.parentNode;
			}
		}
	};

	/**
	 * Scroll to the method
	 * @param  {string} name The method to scroll to
	 */
	var scrollToMethod = function ( name ) {
		if ( !name ) return;
		var methodParent = getMethod( Object.prototype.toString.call( name ) === '[object Array]' ? name[1] : name );
		if ( !methodParent ) return;
		var method = methodParent.querySelector( 'form' );
		if ( !method ) return;
		method.style.display = 'block';
		methodParent.id = 'js-method-scrollto';
		setTimeout((function() {
			smoothScroll.animateScroll( '#js-method-scrollto', null, { updateURL: false } );
		}), 264);
	};

	/**
	 * Toggle the select IO-Docs API
	 * @param  {String} val The API select value to activate
	 */
	var toggleAPI = function ( val ) {
		var options = select.options;
		for ( var i = 0, len = options.length; i < len; i++ ) {
			if ( options[i].innerHTML.toLowerCase().trim() === decodeURI( val ).toLowerCase() ) {
				select.value = options[i].value;
				break;
			}
		}
		if ( 'createEvent' in document ) {
			var change = document.createEvent( 'HTMLEvents' );
			change.initEvent( 'change', false, true );
			select.dispatchEvent( change );
			return;
		}
		select.fireEvent( 'onchange' );
	};

	/**
	 * Toggle the select IO-Docs API
	 * @param  {String} val The API select value to activate
	 */
	toggleIODocs.toggle = function ( api, method, options ) {

		// Variables
		var localSettings = extend( settings || defaults, options || {} );
		select = document.querySelector( '#apiId' ); // API selector
		api = api ? api : /[\\?&]api=([^&#]*)/i.exec(root.location.href);
		method = method ? method : /[\\?&]method=([^&#]*)/i.exec(root.location.href);

		// Sanity check
		if ( !select || !api || api.length < 2 ) return;

		// Update selected value
		toggleAPI( Object.prototype.toString.call( api ) === '[object Array]' ? api[1] : api );

		// Scroll to selected method
		scrollToMethod( method );

		// Callback
		localSettings.callback( select, api, method );

	};


	/**
	 * Destroy the current initialization.
	 * @public
	 */
	toggleIODocs.destroy = function () {

		if ( !settings ) return;

		// Remove init class
		document.documentElement.classList.remove( settings.initClass );

		// Scroll back to the top of the page
		root.scroll( 0, 0 );

		// Reset select menu
		toggleAPI(0);

		// Reset variables
		settings = null;
		select = null;

	};

	/**
	 * Initialize script
	 * @public
	 * @param {Object} options User settings
	 */
	toggleIODocs.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Only run on IO-Docs page
		if ( !document.body.classList.contains( 'page-ioDocs' ) ) return;

		// Destroy any existing initializations
		toggleIODocs.destroy();

		// Merge user options with defaults
		settings = extend( true, defaults, options || {} );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Toggle IO-Docs
		toggleIODocs.toggle( null, null, settings );

	};


	//
	// Public APIs
	//

	return toggleIODocs;

}));
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
	buoy.forEach(navs, (function (nav) {
		if ( nav.getAttribute( 'data-nav-toggle' ) ) return; // Skip if attribute already exists
		var id = nav.href ? '#' + nav.href.split('#')[1] : '#';
		nav.setAttribute( 'data-nav-toggle', id );
	}));

})(window, document);


// Sticky Footer
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var footers = document.querySelectorAll( '.js-sticky-footer' );

	// Add attributes
	buoy.forEach(footers, (function (footer) {
		if ( footer.getAttribute( 'data-sticky-footer' ) ) return; // Skip if attribute already exists
		footer.setAttribute( 'data-sticky-footer', 'true' );
	}));

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
	buoy.forEach(containers, (function (container) {
		if ( container.getAttribute( 'data-right-height' ) ) return; // Skip if attribute already exists
		container.setAttribute( 'data-right-height', 'true' );
	}));
	buoy.forEach(contents, (function (content) {
		if ( content.getAttribute( 'data-right-height-content' ) ) return; // Skip if attribute already exists
		content.setAttribute( 'data-right-height-content', 'true' );
	}));

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
	buoy.forEach(toggles, (function (toggle) {
		if ( toggle.getAttribute( 'data-modal' ) ) return; // Skip if attribute already exists
		var id = toggle.href ? '#' + toggle.href.split('#')[1] : '#';
		toggle.setAttribute( 'data-modal', id );
	}));
	buoy.forEach(windows, (function (win) {
		if ( win.getAttribute( 'data-modal-window' ) ) return; // Skip if attribute already exists
		win.setAttribute( 'data-modal-window', 'true' );
	}));
	buoy.forEach(closers, (function (closer) {
		if ( closer.getAttribute( 'data-modal-close' ) ) return; // Skip if attribute already exists
		closer.setAttribute( 'data-modal-close', 'true' );
	}));

})(window, document);


// Houdini
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var toggles = document.querySelectorAll( '.js-collapse' );

	// Add attributes
	buoy.forEach(toggles, (function (toggle) {
		if ( toggle.getAttribute( 'data-collapse' ) ) return; // Skip if attribute already exists
		toggle.setAttribute( 'data-collapse' );
	}));

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

	buoy.forEach(navs, (function (nav) {
		if ( nav.getAttribute( 'data-tabs' ) ) return; // Skip if attribute already exists
		nav.setAttribute( 'data-tabs', true );
	}));

	buoy.forEach(tabs, (function (tab) {
		if ( tab.getAttribute( 'data-tab' ) ) return; // Skip if attribute already exists
		tab.setAttribute( 'data-tab', true );
	}));

	buoy.forEach(contents, (function (content) {
		if ( content.getAttribute( 'data-tabs-content' ) ) return; // Skip if attribute already exists
		content.setAttribute( 'data-tabs-content', true );
	}));

	buoy.forEach(panes, (function (pane) {
		if ( pane.getAttribute( 'data-tabs-pane' ) ) return; // Skip if attribute already exists
		pane.setAttribute( 'data-tabs-pane', true );
	}));

})(window, document);


// Smooth Scroll
;(function (window, document, undefined) {

	'use strict';

	// Feature test
	if ( !document.querySelector ) return;

	// Variables
	var links = document.querySelectorAll( '.js-scroll' );

	// Add attributes
	buoy.forEach(links, (function (link) {
		if ( link.getAttribute( 'data-scroll' ) ) return; // Skip if attribute already exists
		link.setAttribute( 'data-scroll', 'true' );
	}));

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
	buoy.forEach(headers, (function (header) {
		if ( header.getAttribute( 'data-gumshoe-header' ) ) return; // Skip if attribute already exists
		header.setAttribute( 'data-gumshoe-header', 'true' );
	}));
	buoy.forEach(lists, (function (list) {
		if ( list.getAttribute( 'data-gumshoe' ) ) return; // Skip if attribute already exists
		list.setAttribute( 'data-gumshoe', 'true' );
	}));

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
	buoy.forEach(dropdowns, (function (dropdown) {
		if ( dropdown.getAttribute( 'data-dropdown' ) ) return; // Skip if attribute already exists
		dropdown.setAttribute( 'data-dropdown', 'true' );
	}));
	buoy.forEach(menus, (function (menu) {
		if ( menu.getAttribute( 'data-dropdown-menus' ) ) return; // Skip if attribute already exists
		menu.setAttribute( 'data-dropdown-menu', 'true' );
	}));

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
		buoy.forEach(rows, (function (row) {

			// Get cells within the row
			var cells = row.querySelectorAll( 'td' );

			buoy.forEach(cells, (function (cell, index) {
				cell.setAttribute( 'data-label', labels[index].innerHTML );
			}));

		}));

	};

	// Loop through each responsive table
	buoy.forEach(tables, (function (table) {
		addLabels( table );
	}));

})(window, document);