/*!
 * YOUR-CLIENT-NAME-WITHOUT-SPACES v1.0.0: Portal theme for YOUR-CLIENT-NAME
 * (c) 2016 YOUR-NAME
 * MIT License
 * https://github.com/mashery/sparrow
 */

/**
 * conditionalFormFields.js
 * @description Show or hide contact form fields based on the response to one question
 * @param {string}   question  Selector for question (uses querySelector)
 * @param {object}   answers   The answers, and the fields to show when they're selected
 * @param {function} callback  A callback to run after fields are shown and hidden
 * @version 0.0.1
 * @author  Chris Ferdinandi
 *
 * Example:

	conditionalContactFields('.contact_request_startup', {
		"0": [
			'contact_request_su_location',
			'contact_request_su_idea',
		],
		"1": [
			'contact_request_org',
			'contact_request_wholesale',
			'contact_request_destinations',
			'contact_request_channels',
			'contact_request_supplier',
			'contact_request_fit',
			'contact_request_partners',
			'contact_request_turnover',
		]
	});

 */
var conditionalFormFields = function ( question, answers, callback ) {

	'use strict';


	// Sanity check
	if ( !question || !answers || Object.prototype.toString.call(answers) !== '[object Object]' ) return;

	// Feature test
	if ( !document.querySelector || !window.addEventListener ) return;


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
			for ( var i = 0 ; i < collection.length; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
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

	var hideField = function ( field ) {
		if ( !field ) return;
		field.style.display = 'none';
		field.style.visibility = 'hidden';
		if ( !field.value || field.value === ''  ) {
			field.value = 'null';
		}
	};

	var showField = function ( field ) {
		if ( !field ) return;
		field.style.display = 'block';
		field.style.visibility = 'visible';
		if ( field.value === 'null' ) {
			field.value = '';
		}
	};

	var hideFields = function ( chosen ) {
		forEach(answers, (function (fields, answer) {

			// Don't hide the select answer fields
			if ( chosen.toString() === answer.toString() ) return;

			// Sanity check
			if ( Object.prototype.toString.call(fields) !== '[object Array]' ) return;

			// Hide the fields
			forEach(fields, (function (selector) {
				hideField( document.querySelector( '[for="' + selector + '"]' ) );
				hideField( document.querySelector( '#' + selector ) );
			}));

		}));
	};

	var showFields = function ( chosen ) {

		// Get the fields
		var fields = answers[chosen];

		// Sanity check
		if ( !fields ) return;
		if ( Object.prototype.toString.call(fields) !== '[object Array]' ) return;

		// Hide the fields
		forEach(fields, (function (selector) {
			showField( document.querySelector( '[for="' + selector + '"]' ) );
			showField( document.querySelector( '#' + selector ) );
		}));

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest( event.target, question );
		if ( !toggle ) return;
		hideFields( toggle.value );
		showFields( toggle.value );
		if ( callback && typeof( callback ) === 'function') {
			callback( toggle );
		}
	};



	//
	// Event Listeners and inits
	//

	// Get the question selector
	var selector = document.querySelector( question );
	if ( !selector ) return;

	// Show/hide fields on load
	hideFields( selector.value );

	// Listen for click events
	document.addEventListener('click', eventHandler, false);

};