/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		jquerymobile: {
			deps: [
				'jquery'
			],
			exports: 'jqm'
		}
	},
	paths: {
		jquery: 'lib/jquery-2.2.3',
		jquerymobile: 'lib/jquery.mobile-1.4.5',
		underscore: '../node_modules/underscore/underscore',
		backbone: '../node_modules/backbone/backbone',
		text: '../node_modules/requirejs-text/text'
	}
});

require([
	'jquery',
	'jquerymobile',
	'backbone',
	'views/app',
	'routers/router'
], function ($, jqm, Backbone, AppView, AppRouter) {
	/*jshint nonew:false*/

	// Initialize routing and start Backbone.history()
	var router = new AppRouter();
	Backbone.history.start();
});