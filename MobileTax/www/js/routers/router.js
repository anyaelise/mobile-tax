/*global define*/
define([
	'jquery',
	'backbone',
	'views/app',
	'views/RegistrationView',
	'views/MenuView',
	'views/NewReturnView',
	'views/ContinueReturnView'
], function ($, Backbone, AppView, RegistrationView, MenuView, NewReturnView, ContinueReturnView) {
	'use strict';

	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'home',
			'register': 'registrationView',
			'menu' : 'menuView',
			'newReturn': 'newReturnView',
			'newReturn/:id': 'newReturnView',
			'continueReturn': 'continueReturnView'
		},

		home: function() {
			console.log("going home");
			this.view = new AppView();
		},

		registrationView: function() {
			console.log("going to registration form");
			this.view = new RegistrationView();
		},

		menuView: function() {
			console.log("going to menu");
			this.view = new MenuView();
		},

		newReturnView: function(id) {
			console.log("starting new return");
			var options = {id: id};
			this.view = new NewReturnView(options);
		},

		continueReturnView: function() {
			console.log("showing saved returns");
			this.view = new ContinueReturnView();
		}
	});

	return AppRouter;
});