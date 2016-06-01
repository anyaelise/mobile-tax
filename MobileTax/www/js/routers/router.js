/*global define*/
define([
	'jquery',
	'backbone'
], function ($, Backbone) {
	'use strict';

	var AppRouter = Backbone.Router.extend({
		routes: {
			'*default': 'home'
		},

		home: function (param) {
			console.log("going home!!");
		}
	});

	return AppRouter;
});