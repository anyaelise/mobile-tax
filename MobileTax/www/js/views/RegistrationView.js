/*global define*/

define([
	'jquery',
	'underscore',
	'backbone',
	'jquerymobile',
    'jqueryvalidation',
	'text!templates/registration-form.html'
], function ($, _, Backbone, JQM, JQV, Registration) {
	'use strict';
	
	var RegistrationView = Backbone.View.extend({

		el: '#page',

		events: {
            'submit':        'doRegistration'		
		},

		initialize: function (options) { 
            window.localStorage.removeItem('passCode');
            $("#wrong-passcode").popup("close");        

            this.render();
		},

		template: _.template(Registration),

		render: function() {			
			this.$el.html(this.template);
            $('.ui-page').enhanceWithin();
            $('#save-registration').validate({
                rules: {
                    displayname: {
                        required: true
                    },
                    phone: {
                        required: true
                    },
                    password: {
                        required: true
                    },
                    password2: {
                        required: true,
                        equalTo: '#password'
                    }
                },
                messages: {
                    displayname: {
                        required: "Please enter your name."
                    },
                    phone: {
                        required: "Please enter your phone number."
                    },
                    password: {
                        required: "Please enter your passcode."
                    },
                    password2: {
                        required: "Please confirm your passcode.",
                        equalTo: "Passcodes do not match."
                    }
                },
                errorPlacement: function (error, element) {
                    error.appendTo(element.parent().prev());                
                },
                invalidHandler: function(event, validator) {
                    var errors = validator.numberOfInvalids();
                    console.log("invalid form");
                    console.log(errors);
                }
            });
			return this.$el;
		},

        doRegistration: function(event) {
            event.preventDefault();
            var formData = $('form').serialize();
            var params = this.getQueryParameters(formData);
            //console.log(params.password);
            window.localStorage.setItem('passCode', params.password);
            //console.log(window.localStorage['passCode']);
            Backbone.history.navigate('menu', true);
        },

        getQueryParameters : function(str) {
            /* taken from https://github.com/youbastard/jquery.getQueryParameters */
            return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
        }

	});

	return RegistrationView;

});