/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
	'text!templates/new-return.html'
], function ($, _, Backbone, JQM, Return) {
	'use strict';
	
	// Our overall **AppView** is the top-level piece of UI.
	var NewReturnView = Backbone.View.extend({

		el: '#page',

		events: {
			/*'click #menu-start': 		'startReturn', 
			'click #menu-continue':		'continueReturn',
			'click #menu-submitted': 	'submitReturn',
			'click #menu-invoices': 	'viewInvoices'*/
		},

		initialize: function (options) {
			this.render();
		},

		template: _.template(Return),

		render: function() {			
			this.$el.html(this.template);
			return this.$el;
		}

	});

	return NewReturnView;

});