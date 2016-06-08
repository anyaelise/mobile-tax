/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
	'text!templates/registration-view.html',
	'text!templates/login-view.html'
], function ($, _, Backbone, JQM, register, login) {
	'use strict';
	
	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		events: {
			'click #registration-button': 	'startRegistration', 
			'click #login-button':			'doLogin'
		},

		initialize: function (options) {
			this.render();
		},

		render: function() {
			//check for registration, then render either registration option or login option
			var landing = (window.localStorage.passCode) ? _.template(login) : _.template(register);
			this.$el.find('#landing').html(landing);
			return this.$el;
		},

		startRegistration: function(params) {
			console.log("starting registration");
		},

		doLogin: function(params) {
			console.log("logging in");
			Backbone.history.navigate('menu', true);
		}
	});

	return AppView;

});