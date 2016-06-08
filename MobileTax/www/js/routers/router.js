/*global define*/
define([
	'jquery',
	'backbone',
	'views/app',
	'views/MenuView',
	'views/NewReturnView'
], function ($, Backbone, AppView, MenuView, NewReturnView) {
	'use strict';

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'home',
			'menu' : 'menuView',
			'newReturn': 'newReturnView'
		},

		home: function (param) {
			console.log("going home");
			this.view = new AppView();
		},

		menuView: function() {
			console.log("going to menu");
			this.view = new MenuView();
		},

		newReturnView: function() {
			console.log("starting new return");
			this.view = new NewReturnView();
		}
	});

	return AppRouter;
});