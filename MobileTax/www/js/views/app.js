/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
	'text!templates/landing-view.html',
	'text!templates/registration-view.html',
	'text!templates/login-view.html'
], function ($, _, Backbone, JQM, landing, register, login) {
	'use strict';
	
	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#page',

		template: _.template(landing),

		events: {
			'click #registration-button': 	'startRegistration', 
			'click #login-button':			'doLogin'
		},

		initialize: function (options) {
			this.render();
			$('.ui-page').enhanceWithin();
		},

		render: function() {
			//check for registration, then render either registration option or login option
			var choice = (window.localStorage.passCode) ? _.template(login) : _.template(register);
			this.$el.html(this.template);
			this.$el.find('#landing').html(choice);
			return this.$el;
		},

		startRegistration: function(params) {
			Backbone.history.navigate('register', true);
		},

		doLogin: function(params) {
			if(window.localStorage.passCode == $('#passcode').val()) {
				Backbone.history.navigate('menu', true);
			} else {				
				$("#wrong-passcode").popup("open");
				$('#passcode').val("");
			}
		}
	});

	return AppView;

});