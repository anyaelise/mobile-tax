/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
	'text!templates/saved-returns.html'
], function ($, _, Backbone, JQM, Saved) {
	'use strict';
	
	var ContinueReturnView = Backbone.View.extend({

		el: '#page',

		events: {
            'click .continue':      'continueReturn',
            'click .delete':        'deleteReturn'		
		},

		initialize: function (options) {         
			this.render();
		},

		template: _.template(Saved),

		render: function() {			
			this.$el.html(this.template);

            var storage = Object.keys(window.localStorage);
            storage.forEach(function(key) {
                if(key.search(/^saved/) >= 0) {
                    var splitArray = key.split('-');
                    var timestamp = parseInt(splitArray[1]);
                    var date = new Date(timestamp).toLocaleString();
                    $('ul').append('<li class="continue"> VAT Return - ' + date + ' <button class="continue" id="continue-' + key + '"> Continue </button>' + '<button class="delete" id="delete-' + key + '"> Delete </button>');
                }
            });

            $('.ui-page').enhanceWithin();

			return this.$el;
		},

        continueReturn: function(e) {
            e.preventDefault();
            Backbone.history.navigate('newReturn/'+ e.target.id.substring(9), true);
        },

        deleteReturn: function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.localStorage.removeItem(e.target.id.substring(7));
            this.render();
        }

	});

	return ContinueReturnView;

});