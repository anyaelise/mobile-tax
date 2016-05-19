var Controller = function() {
    
    var controller = {
        self: null,

        initialize: function() {
            //window.localStorage.removeItem('passCode');
            self = this; 
            self.bindEvents();
            self.checkRegistration();
        },

        bindEvents: function() {
            $('#page').on('click', '#registration-button', this.startRegistration);
            $('#page').on('click', '#login-button', this.doLogin);
            $('#page').on('click', '#menu-nav-two, #menu-nav-three, #menu-nav-four', function() {
                $('#menu-nav-one').removeClass('ui-btn-active');
            });

            /* format numbers */
            $('#page').on('change', '#sales-general, #sales-zero, #sales-special, #sales-exempt, #purchases-general, #purchases-zero, #purchases-special, #purchases-exempt, #vat-imported, #vat-withheld, #other-credit, #exempt-purchases', this.formatNumbers);

            /* calculate totals */
            $('#page').on('keyup', '#sales-general, #sales-zero, #sales-special, #sales-exempt', this.calculateSales);
            $('#page').on('keyup', '#purchases-general, #purchases-zero, #purchases-special, #purchases-exempt', this.calculatePurchases);
            $('#page').on('keyup', '#vat-imported, #vat-withheld, #other-credit, #exempt-purchases', this.calculateCredits);
        },

        checkRegistration: function() {
            var registrationKey = window.localStorage.passCode;
            if(registrationKey) {
                this.renderLogin();
            } else {
                this.renderRegistration();
            }
        },

        renderRegistration: function() {
            var $page = $('#landing');
            $page.empty();
            $page.load("./views/registration-view.html");
        },

        startRegistration: function(e) {
            e.preventDefault();
            self.renderRegistrationForm();
        },

        renderRegistrationForm: function() {
            var $page = $('#page');
            $page.empty();
            $page.load("./views/registration-form.html", function(data) {
                $('#save-registration').submit(function(e) {
                    e.preventDefault();
                    window.localStorage.setItem('passCode', 'present');
                    self.renderMenuView();
                });
            });
        },

        renderLogin: function() {
            var $page = $('#landing');
            $page.empty();
            $page.load("./views/login-view.html");
        },

        doLogin: function(e) {
            e.preventDefault();
            self.renderMenuView();
        },

        renderMenuView: function() {
            var $page = $('#page');
            $page.empty();
            $page.load("./views/menu-view.html", function(data) {
                $('#menu-start').click(12, self.startReturn);
                $('#menu-continue').click(self.continueReturn);
            });
        },

        startReturn: function(id) {
            var $page = $('#page');
            $page.empty();
            $page.load("./views/new-return.html", function(data) {
                /* check to load saved data */
                if(!id.data) {
                    var savedData = window.localStorage[id];
                    var unserializedData = window.JSON.parse(savedData);
                    var dataObj = self.getQueryParameters(unserializedData);
                    delete dataObj.formType;
                    for(var key in dataObj) {
                        var selector = '#' + key;
                        $(selector).val(dataObj[key]);
                    }
                    self.calculateSales();
                    self.calculatePurchases();
                    self.calculateCredits();
                }

                $('#new-vat-return').submit(function(e) {
                    e.preventDefault();
                    console.log(e);
                });

                $('#save-return').click(function(e) {
                    e.preventDefault();
                    var formData = $('#new-vat-return').serialize() + '&formType=VAT';
                    var stringified = window.JSON.stringify(formData);
                    var timestamp = 'saved-' + Date.now();
                    window.localStorage.setItem(timestamp, stringified);
                    self.continueReturn();
                });
            });
        },

        continueReturn: function() {
            var storage = Object.keys(window.localStorage);
            var $page = $('#page');
            $page.empty();
            $page.load("./views/saved-returns.html", function(data) {
                storage.forEach(function(key) {
                    if(key.search(/^saved/) >= 0) {
                        var splitArray = key.split('-');
                        var timestamp = parseInt(splitArray[1]);
                        var date = new Date(timestamp).toLocaleString();
                        $('ul').append('<li class="continue"> VAT Return - ' + date + ' <button class="continue" id="continue-' + key + '"> Continue </button>' + '<button class="delete" id="delete-' + key + '"> Delete </button>');
                    }
                });

                $('.continue').click(function(e) {
                    e.preventDefault();
                    self.startReturn(e.target.id.substring(9));
                });

                $('.delete').click(function(e) {
                    e.preventDefault()
                    window.localStorage.removeItem(e.target.id.substring(7));
                    self.continueReturn();
                });
            });
        },

        calculateSales: function() {
            var totalSales = parseFloat($('#sales-general').val() || 0.00) 
                            + parseFloat($('#sales-zero').val() || 0.00) 
                            + parseFloat($('#sales-special').val() || 0.00) 
                            + parseFloat($('#sales-exempt').val() || 0.00);
            $('#total-sales p').html('KES ' + totalSales.toFixed(2));
            self.calculateVAT();
        },

        calculatePurchases: function() {
            var totalPurchases = parseFloat($('#purchases-general').val() || 0.00) 
                            + parseFloat($('#purchases-zero').val() || 0.00) 
                            + parseFloat($('#purchases-special').val() || 0.00) 
                            + parseFloat($('#purchases-exempt').val() || 0.00);
            $('#total-purchases p').html('KES ' + totalPurchases.toFixed(2));
            self.calculateVAT();
        },

        calculateCredits: function() {
            var totalCredits = parseFloat($('#vat-imported').val() || 0.00) 
                            + parseFloat($('#vat-withheld').val() || 0.00) 
                            + parseFloat($('#other-credit').val() || 0.00);
            $('#total-credits p').html('KES ' + totalCredits.toFixed(2));
            self.calculateVAT();
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

        formatNumbers: function(event) {
            var selector = '#' + event.target.id;
            var value = $(selector).val();
            if(value) {
                $(selector).val((parseFloat(value)).toFixed(2));
            }
        },

        getQueryParameters : function(str) {
            /* taken from https://github.com/youbastard/jquery.getQueryParameters */
            return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
        }
    }

    controller.initialize();
    return controller;
}