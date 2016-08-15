/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
	'text!templates/menu-view.html'
], function ($, _, Backbone, JQM, Menu) {
	'use strict';
	
	var MenuView = Backbone.View.extend({

		el: '#page',

		events: {
			'click #menu-start': 		'startReturn', 
			'click #menu-continue':		'continueReturn',
			'click #menu-submitted': 	'submitReturn',
			'click #menu-invoices': 	'viewInvoices'
		},

		initialize: function (options) {
			this.render();
			$('.ui-page').enhanceWithin();
		},

		template: _.template(Menu),

		render: function() {			
			this.$el.html(this.template);
			return this.$el;
		},

		startReturn: function() {
			Backbone.history.navigate('newReturn', true);
		},

		continueReturn: function() {
			Backbone.history.navigate('continueReturn', true);
		},

		submitReturn: function() {

		},

		viewInvoices: function() {
			
		}

	});

	return MenuView;

});