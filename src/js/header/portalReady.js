/**
 * portalReady.js
 * Initialize scripts and run other methods after Portal is loaded and ready.
 * Copyright (c) 2017. TIBCO Software Inc. All Rights Reserved.
 */

var portalReady = function ( fn ) {

	// Sanity check
	if ( typeof fn !== 'function' ) return;

	// If document is already loaded, run method
	if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener( 'DOMContentLoaded', fn, false );

};