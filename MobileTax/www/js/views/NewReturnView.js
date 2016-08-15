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
			'change input[type=text]': 	'formatNumbers',
			'keyup .sales': 			'calculateSales',
			'keyup .purchases': 		'calculatePurchases',
			'keyup .credits': 			'calculateCredits',
            'click #save-return':       'saveReturn',
            'submit':                   'formSubmission'
		},

		initialize: function (options) {
			this.render();
            
            if(options.id) {
                var savedData = window.localStorage[options.id];
                var unserializedData = window.JSON.parse(savedData);
                var dataObj = this.getQueryParameters(unserializedData);
                delete dataObj.formType;
                for(var key in dataObj) {
                    var selector = '#' + key;
                    $(selector).val(dataObj[key]);
                }
                this.calculateSales();
                this.calculatePurchases();
                this.calculateCredits();
            }
		},

		template: _.template(Return),

		render: function() {	
            var _this = this;		
			this.$el.html(this.template);
            $('.ui-page').enhanceWithin();

            $.validator.setDefaults({
                ignore: ""
            });

            $('#new-vat-return').validate({
                rules: {
                    "sales-general": {
                        number: true
                    },
                    "sales-zero": {
                        number: true
                    },
                    "sales-special": {
                        number: true
                    },
                    "sales-exempt": {
                        number: true
                    },
                    "purchases-general": {
                        number: true
                    },
                    "purchases-zero": {
                        number: true
                    },
                    "purchases-special": {
                        number: true
                    },
                    "purchases-exempt": {
                        number: true
                    },
                    "vat-imported": {
                        number: true
                    },
                    "vat-withheld": {
                        number: true
                    },
                    "other-credit": {
                        number: true
                    },
                    "output-vat": {
                        number: true
                    },
                    "input-vat": {
                        number: true
                    },
                    "withheld-vat": {
                        number: true
                    }
                },
                messages: {
                    "sales-general": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "sales-zero": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "sales-special": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "sales-exempt": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "purchases-general": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "purchases-zero": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "purchases-special": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "purchases-exempt": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "vat-imported": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "vat-withheld": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "other-credit": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "output-vat": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "input-vat": {
                        number: "Invalid value. Please enter a monetary amount."
                    },
                    "withheld-vat": {
                        number: "Invalid value. Please enter a monetary amount."
                    }
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().prev());                
                },
                invalidHandler: function(event, validator) {
                    console.log(validator);
                    var map = validator.errorMap;
                    console.log(map);  
                    for (key in map) {
                        console.log(key);
                        console.log($('#tabsdiv').find($('#'+key)));
                    }
                    //console.log($('#tabsdiv').find(validator.))
                    var errors = validator.numberOfInvalids();
                    //$("#return-errors").popup("open");
                    $('#tabsdiv').tabs("option", "active", 1);
                }
            });

			return this.$el;
		},

		formatNumbers: function(event) {
            var selector = '#' + event.target.id;
            var value = $(selector).val();
            if(value && !isNaN(value)) {
                $(selector).val((parseFloat(value)).toFixed(2));
            }
        },

        calculateSales: function() {
            var totalSales = parseFloat($('#sales-general').val() || 0.00) 
                            + parseFloat($('#sales-zero').val() || 0.00) 
                            + parseFloat($('#sales-special').val() || 0.00) 
                            + parseFloat($('#sales-exempt').val() || 0.00);
            $('#total-sales p').html('KES ' + totalSales.toFixed(2));
            this.calculateVAT();
        },

        calculatePurchases: function() {
            var totalPurchases = parseFloat($('#purchases-general').val() || 0.00) 
                            + parseFloat($('#purchases-zero').val() || 0.00) 
                            + parseFloat($('#purchases-special').val() || 0.00) 
                            + parseFloat($('#purchases-exempt').val() || 0.00);
            $('#total-purchases p').html('KES ' + totalPurchases.toFixed(2));
            this.calculateVAT();
        },

        calculateCredits: function() {
            var totalCredits = parseFloat($('#vat-imported').val() || 0.00) 
                            + parseFloat($('#vat-withheld').val() || 0.00) 
                            + parseFloat($('#other-credit').val() || 0.00);
            $('#total-credits p').html('KES ' + totalCredits.toFixed(2));
            this.calculateVAT();
        },

        calculateVAT: function() {
            var outputVAT = parseFloat($('#sales-general').val() || 0.00) * 0.16;
            var inputVAT = parseFloat($('#purchases-general').val() || 0.00) * 0.16;
            var withheldVAT = parseFloat($('#vat-withheld').val() || 0.00);
            var totalVAT =  outputVAT - inputVAT - withheldVAT;
            $('#output-vat p').html('KES ' + outputVAT.toFixed(2));
            $('#input-vat p').html('KES ' + inputVAT.toFixed(2));
            $('#withheld-vat p').html('KES ' + withheldVAT.toFixed(2));

            if(totalVAT > 0 ) {
                $('#vat-due').html('VAT Due: KES ' + totalVAT.toFixed(2));
            } else {
                $('#vat-due').html('VAT Due: (KES ' + ((-1*totalVAT).toFixed(2)) + ')');
            }            
        },

        saveReturn: function(e) {
            e.preventDefault();
            var formData = $('#new-vat-return').serialize() + '&formType=VAT';
            var stringified = window.JSON.stringify(formData);
            var timestamp = 'saved-' + Date.now();
            window.localStorage.setItem(timestamp, stringified);
            Backbone.history.navigate('continueReturn', true);
        },

        formSubmission: function(e) {
            e.preventDefault();
            console.log('form submitted');
        },

        getQueryParameters : function(str) {
            /* taken from https://github.com/youbastard/jquery.getQueryParameters */
            return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
        }

	});

	return NewReturnView;

});