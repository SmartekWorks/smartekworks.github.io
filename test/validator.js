//

(function () {
    var validateAny = function ($input) {
        return !!$input.val();
    },
    validateKatakana = function ($input) {
        return !!$input.val().match(/^[ァ-ン０-９ー－]+$/);
    },
    validatePostal = function ($input) {
        return !!$input.val().match(/^\d+\-\d+$/);
    },
    validateNumber = function ($input) {
        return !!$input.val().match(/^\d+$/);
    },
    validateFull = function ($input) {
        return $input.val() && !$input.val().match(/[a-zA-Z0-9]+/);
    };
})();


(function () {
    var StartStop = function () {};
    StartStop.prototype = {
        start: function () {
            this.isStopped = false;
            this.isValidated = false;
        },

        stop: function () {
            this.isStopped = true;
            this.validate();
            this.reset();
        },

        reset: function () {}
    };


    var ValidationCollection = function () {
        if (arguments[0] instanceof Array) {
            this.targets = arguments[0];
        }
        else {
            this.targets = Array.prototype.slice.call(arguments);
        }
        this.init();
    };

    ValidationCollection.prototype = {
        init: function () {
            var self = this;
           /*$('form').live('submit', function () {
                return self.validate();
            });*/

            $('#next').click(function () {
                return self.validate();
            });
        },

        validate: function () {
            var allTrue = true,
            i, l, top, temp, from, to;

            for (i = 0, l = this.targets.length; i < l; i += 1) {
                if (!this.targets[i].validate() && !this.targets[i].isValid()) {
                    allTrue = false;
                }
            }

            if (allTrue) {
                return true;
            }

            top = Number.MAX_VALUE;
            for (i = 0, l = this.targets.length; i < l; i += 1) {
                if (this.targets[i].$td.length) {
                    temp = this.targets[i].$td.offset().top;
                }
                if (!this.targets[i].isValid() && temp < top) {
                    top = temp;
                }
            }

            from = {property: $(window).scrollTop()};
            to = {property: top - 20};
            $(from).animate(to, {
                duration: 1000,
                step: function () {
                    window.scrollTo(0, this.property);
                }
            });

            return false;
        }
    };
    window.ValidationCollection = ValidationCollection;


    /**
     * セレクトボックスが全部選択されているか
     */
    var ValSelects = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };

    ValSelects.prototype = new StartStop();
    ValSelects.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0 || this.$td.find('select').length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$errorMessage = createErrorMessage(this.$td, name + 'を選択してください。');
        this.$td.find('select').change(function () {
            if (self.validated) {
                self.validate();
            }
        });
    };
    ValSelects.prototype.validate = function () {
        var result = this.isValid();

        this.validated = true;

        if (this.$errorMessage) {
            this.$errorMessage.hide();
        }

        if (result) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        this.$errorMessage.show();
    };
    ValSelects.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var result = true;

        this.$td.find('select').each(function () {
            if (!$(this).find(':selected').val()) {
                result = false;
            }
        });

        return result;
    };
    ValSelects.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }
        this.$td.find('option[value=""]').attr('selected', 'selected');
    };
    window.ValSelects = ValSelects;


    /**
     * input, 数字縛り
     */
    var ValNumber = function (td, name, allowPoint) {
        this.$td = $(td);
        this.allowPoint = !!allowPoint;
        this.init(name);
    };

    ValNumber.prototype = new StartStop();
    ValNumber.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$td.find('input').bind('blur', function () {
            z2h($(this));
            self.validate();
        });
    };

    ValNumber.prototype.validate = function () {
        var result = this.isValid();

        this.validated = true;

        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (result) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        if (this.$td.find('input').val()) {
            this.$errorMessageInvalid.show();
        }
        else {
            this.$errorMessageEmpty.show();
        }
    };
    ValNumber.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var self = this,
        result = true;

        this.$td.find('input').each(function () {
            if (self.allowPoint) {
                if (!this.value.match(/^\d+(\.\d+)?$/)) {
                    result = false;
                }
            }
            else {
                if (!this.value.match(/^\d+$/)) {
                    result = false;
                }
            }
        });

        return result;
    };
    window.ValNumber = ValNumber;


    /**
     * ラジオボタン + input
     */
    var ValRadioInput1 = function (td, name1, name2) {
        this.$td = $(td);
        this.init(name1, name2);
    };
    ValRadioInput1.prototype = new StartStop();
    ValRadioInput1.prototype.init = function (name1, name2) {
        var self = this,
        $lastRadio = this.$td.find('input[type="radio"]:last')[0],
        selectedValue = this.$td.find(':checked').val();

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$errorMessageSelect = createErrorMessage(this.$td, name1 + 'を選択してください。');
        this.$errorMessageText = createErrorMessage(this.$td, name2 + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$radios = this.$td.find('input[type="radio"]');
        this.$text = this.$td.find('input[type="text"]');

        if (!selectedValue || this.$td.find(':checked')[0].id != $lastRadio.id) {
            this.$text.attr('disabled', 'disabled');
        }

        this.$radios.click(function () {
            checkRadio.call(this);
        });

        this.$radios.each(function () {
            if (this.checked) {
                checkRadio.call(this);
            }
        });


        function checkRadio() {
            if (this != $lastRadio) {
                self.$text.attr('disabled', 'disabled');
                self.$text.val('');
            }
            else {
                self.$text.removeAttr('disabled');
            }

            if (self.isValidated && self.$td.hasClass('error')) {
                self.validate();
            }
        }

        this.$text.bind('blur', function () {
            self.validate();
        });
    };
    ValRadioInput1.prototype.validate = function () {
        this.isValidated = true;

        if (this.$errorMessageSelect) {
            this.$errorMessageSelect.hide();
            this.$errorMessageText.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return true;
        }

        this.$td.addClass('error');

        if (!this.$td.find(':checked').val()) {
            this.$errorMessageSelect.show();
            return false;
        }

        if (!this.$text.val()) {
            this.$errorMessageText.show();
        }
        else if (containsHankaku(this.$text.val())) {
            this.$errorMessageInvalid.show();
        }

        return false;
    };
    ValRadioInput1.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var selectedValue;

        selectedValue = this.$td.find(':checked').val();

        if (!selectedValue) {
            return false;
        }

        if (this.$td.find(':checked')[0] != this.$td.find('input[type="radio"]:last')[0]) {
            return true;
        }

        h2z(this.$text);

        return (this.$text.val() && !containsHankaku(this.$text.val()));
    };
    ValRadioInput1.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.validated = false;
        this.$radios.removeAttr('checked');
        this.$text.val('');
        this.$text.attr('disabled', 'disabled');
    };
    window.ValRadioInput1 = ValRadioInput1;


    /**
     * 2つのinput
     */
    var Val2Texts = function (td, name1, name2, isKana) {
        this.$td = $(td);
        this.isKana = isKana;
        this.init(name1, name2);
    };
    Val2Texts.prototype = new StartStop();
    Val2Texts.prototype.init = function (name1, name2) {
        var self = this,
        validated1, validated2;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$errorMessage1 = createErrorMessage(this.$td, name1 + 'を入力してください。');
        this.$errorMessageInvalid1 = createErrorMessage(this.$td, name1 + 'を正しく入力してください。');
        this.$errorMessage2 = createErrorMessage(this.$td, name2 + 'を入力してください。');
        this.$errorMessageInvalid2 = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$input1 = this.$td.find('input:first');
        this.$input2 = this.$td.find('input:last');
        this.$input1.bind('blur', function () {
            validated1 = true;
            self.$errorMessage1.hide();
            self.$errorMessageInvalid1.hide();
            h2z($(this));

            if (!this.value) {
                self.$errorMessage1.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(self.$input1.val()) || (self.regExp && !self.$input1.val().match(self.regExp))) {
                self.$errorMessageInvalid1.show();
                self.$td.addClass('error');
            }
            else if (self.isValidated || validated2) {
                self.validate();
            }
            else {
                self.$td.removeClass('error');
            }
        });
        this.$input2.bind('blur', function () {
            validated2 = true;
            self.$errorMessage2.hide();
            self.$errorMessageInvalid2.hide();
            h2z($(this));

            if (self.isValidated || validated1) {
                self.validate();
            }
            else if (!this.value) {
                self.$errorMessage2.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(self.$input2.val()) || ( self.regExp && !self.$input2.val().match(self.regExp))) {
                self.$errorMessageInvalid2.show();
                self.$td.addClass('error');
            }
            else {
                self.$td.removeClass('error');
            }
        });
    };
    Val2Texts.prototype.validate = function () {
        if (this.$errorMessage1) {
            this.$errorMessage1.hide();
            this.$errorMessage2.hide();
            this.$errorMessageInvalid1.hide();
            this.$errorMessageInvalid2.hide();
            this.isValidated = true;
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input1.val()) {
            this.$errorMessage1.show();
        }
        else if (containsHankaku(this.$input1.val()) || (this.isKana && !this.$input1.val().match(/^[ァ-ン－゛゜]+$/))) {
            this.$errorMessageInvalid1.show();
        }

        if (!this.$input2.val()) {
            this.$errorMessage2.show();
        }
        else if (containsHankaku(this.$input2.val()) || (this.isKana && !this.$input2.val().match(/^[ァ-ン－゛゜]+$/))) {
            this.$errorMessageInvalid2.show();
        }
    };
    Val2Texts.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        if (this.isKana) {
            convertLong(this.$input1);
            convertLong(this.$input2);
        }

        if (!this.$input1.val() || (this.isKana && !this.$input1.val().match(/^[ァ-ン－゛゜]+$/))) {
            return false;
        }

        if (!this.$input2.val() || (this.isKana && !this.$input2.val().match(/^[ァ-ン－゛゜]+$/))) {
            return false;
        }

        if (containsHankaku(this.$input1.val()) || containsHankaku(this.$input2.val())) {
            return false;
        }

        return true;
    };
    window.Val2Texts = Val2Texts;


    /**
     * ラジオボタン
     */
    var ValRadios = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValRadios.prototype = new StartStop();
    ValRadios.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0 || this.$td.find('input[type="radio"]').length == 0) {
            this.stop();
            return;
        }

        this.$errorMessage = createErrorMessage(this.$td, name + 'を選択してください。');
        this.$td.find('input').change(function () {
            self.validate();
        });
    };
    ValRadios.prototype.validate = function () {
        if (this.$errorMessage) {
            this.$errorMessage.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        this.$errorMessage.show();
    };
    ValRadios.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        return (this.$td.find(':checked').length != 0);
    };
    window.ValRadios = ValRadios;


    /**
     * ラジオボタン(リセットあり)
     */
    var ValRadios2 = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValRadios2.prototype = new StartStop();
    ValRadios2.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0 || this.$td.find('input[type="radio"]').length == 0) {
            this.stop();
            return;
        }

        this.$errorMessage = createErrorMessage(this.$td, name + 'を選択してください。');
        this.$td.find('input').change(function () {
            self.validate();
        });
    };
    ValRadios2.prototype.validate = function () {
        if (this.$errorMessage) {
            this.$errorMessage.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        this.$errorMessage.show();
    };
    ValRadios2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        return (this.$td.find(':checked').length != 0);
    };
    ValRadios2.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$td.find('input[type="radio"]').removeAttr('checked');
    };
    window.ValRadios2 = ValRadios2;


    var ValPlanDetail = function (td, v1, v2, v3) {
        this.$td = $(td);
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.init();
    };

    ValPlanDetail.prototype = new StartStop();
    ValPlanDetail.prototype.init = function () {
        var self = this,
        $radios = this.$td.find('input[type="radio"]'),
        $checked = this.$td.find(':checked');

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$errorMessage = createErrorMessage(this.$td, '指定代理請求人の有無を選択してください');
        $radios.click(function () { checkRadio.call(this); });

        if ($checked[0]) {
            checkRadio.call($checked[0]);
        }
        else {
            checkRadio.call($radios[0]);
        }

        function checkRadio() {
            self.$errorMessage.hide();
            self.$td.removeClass('error');
            if (this.value === '0') {
                self.v1.stop();
                self.v2.stop();
                self.v3.stop();
                self.v1.$td.find('input').attr('disabled', 'disabled');
                self.v1.$td.find('input').val('');
                self.v1.$td.find('select').attr('disabled', 'disabled');
                self.v1.$td.find('select option').removeAttr('selected');
                self.v2.$td.find('input').attr('disabled', 'disabled');
                self.v2.$td.find('input').val('');
                self.v2.$td.find('select').attr('disabled', 'disabled');
                self.v2.$td.find('select option').removeAttr('selected');
                self.v3.$td.find('input').attr('disabled', 'disabled');
                self.v3.$td.find('input').val('');
                self.v3.$td.find('select').attr('disabled', 'disabled');
                self.v3.$td.find('select option').removeAttr('selected');
            }
            else {
                self.v1.start();
                self.v2.start();
                self.v3.start();
                self.v1.$td.find('input').removeAttr('disabled');
                self.v1.$td.find('select').removeAttr('disabled');
                self.v2.$td.find('input').removeAttr('disabled');
                self.v2.$td.find('select').removeAttr('disabled');
                self.v3.$td.find('input').removeAttr('disabled');
                self.v3.$td.find('select').removeAttr('disabled');
            }
        }
    };
    ValPlanDetail.prototype.validate = function () {
        if (this.$errorMessage) {
            this.$errorMessage.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$errorMessage.show();
        this.$td.addClass('error');
    };

    ValPlanDetail.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        return (this.$td.find(':checked')[0]);
    };
    window.ValPlanDetail = ValPlanDetail;


    var ValPlanDetail2 = function (td, v1, v2, v3) {
        this.$td = $(td);
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
        this.init(td);
    };

    ValPlanDetail2.prototype = new StartStop();
    ValPlanDetail2.prototype.init = function (td) {
        var self = this,
        $radios = this.$td.find('input[type="radio"]'),
        $checked = this.$td.find(':checked');

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$errorMessage = createErrorMessage(this.$td, '死亡保険金の受取人と契約者との住所に関する項目を選択してください。');
        if (td === '.js-kp-beneficiary'){ // Keepの場合、メッセージ変更
            this.$errorMessage = createErrorMessage(this.$td, '収入保障年金の受取人と契約者との住所に関する項目を選択してください。');
        }
        $radios.click(function () { checkRadio.call(this); });

        if ($checked[0]) {
            checkRadio.call($checked[0]);
        }
        else {
            checkRadio.call($radios[0]);
        }

        function checkRadio() {
            self.$errorMessage.hide();
            self.$td.removeClass('error');
            if (this.value === '0') {
                self.v1.stop();
                self.v2.stop();
                self.v3.stop();
                self.v1.$td.find('input').attr('disabled', 'disabled');
                self.v1.$td.find('input').val('');
                self.v1.$td.find('select').attr('disabled', 'disabled');
                self.v1.$td.find('select option').removeAttr('selected');
                self.v2.$td.find('input').attr('disabled', 'disabled');
                self.v2.$td.find('input').val('');
                self.v2.$td.find('select').attr('disabled', 'disabled');
                self.v2.$td.find('select option').removeAttr('selected');
                self.v3.$td.find('input').attr('disabled', 'disabled');
                self.v3.$td.find('input').val('');
                self.v3.$td.find('select').attr('disabled', 'disabled');
                self.v3.$td.find('select option').removeAttr('selected');
            }
            else {
                self.v1.start();
                self.v2.start();
                self.v3.start();
                self.v1.$td.find('input').removeAttr('disabled');
                self.v1.$td.find('select').removeAttr('disabled');
                self.v2.$td.find('input').removeAttr('disabled');
                self.v2.$td.find('select').removeAttr('disabled');
                self.v3.$td.find('input').removeAttr('disabled');
                self.v3.$td.find('select').removeAttr('disabled');
            }
        }
    };
    ValPlanDetail2.prototype.validate = function () {
        if (this.$errorMessage) {
            this.$errorMessage.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$errorMessage.show();
        this.$td.addClass('error');
    };

    ValPlanDetail2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        return (this.$td.find(':checked')[0]);
    };
    window.ValPlanDetail2 = ValPlanDetail2;


    /**
     * 郵便番号フォーム
     */
    var ValPostal = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValPostal.prototype = new StartStop();
    ValPostal.prototype.init = function () {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, '郵便番号を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, '郵便番号を正しく入力してください。');
        this.validated = !!this.$input.val();
        this.regExp = /^(\d{3}\-\d{4})|(\d{7})$/;

        this.$input.bind('blur', function () {
            z2h(self.$input);
            self.validate();
        });
    };
    ValPostal.prototype.validate = function () {
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
        }
        else {
            this.$errorMessageInvalid.show();
        }
    };
    ValPostal.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        this.validated = true;
        z2h(this.$input);

        if (!this.$input.val() || !this.$input.val().match(this.regExp)) {
            return false;
        }

        return true;
    };
    window.ValPostal = ValPostal;


    /**
     * 郵便番号フォーム２
     * 入力フォーマットチェックのみ(未入力チェックなし)
     */
    var ValPostal2 = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValPostal2.prototype = new StartStop();
    ValPostal2.prototype.init = function () {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');
        this.$errorMessageInvalid = createErrorMessage(this.$td, '郵便番号を正しく入力してください。');
        this.validated = !!this.$input.val();
        this.regExp = /^(\d{3}\-\d{4})|(\d{7})$/;

        this.$input.bind('blur', function () {
            z2h(self.$input);
            self.validate();
        });
    };
    ValPostal2.prototype.validate = function () {
        if (this.$errorMessageInvalid) {
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$input.val()) {
            this.$errorMessageInvalid.show();
        }
    };
    ValPostal2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        this.validated = true;
        z2h(this.$input);

        if (this.$input.val() && !this.$input.val().match(this.regExp)) {
            return false;
        }

        return true;
    };
    window.ValPostal2 = ValPostal2;


    /**
     * 住所
     */
    var ValAddress1 = function (td, name1, name2, name3, isKana) {
        this.$td = $(td);
        this.isKana = (isKana === true);
        this.init(name1, name2, name3);
    };
    ValAddress1.prototype = new StartStop();
    ValAddress1.prototype.init = function (name1, name2, name3) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input:first');
        this.$optionals = this.$td.find('input:not(:first)');
        this.optionals = Array.prototype.slice.call(this.$optionals);
        this.$errorMessageEmpty = createErrorMessage(this.$td, name1 + 'を入力してください。');
        this.$errorMessageInvalid1 = createErrorMessage(this.$td, name1 + 'を正しく入力してください。');
        this.$errorMessageInvalid2 = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$errorMessageInvalid3 = createErrorMessage(this.$td, name3 + 'を正しく入力してください。');
        this.regExp = /^[ァ-ンー０-９・－Ａ-Ｚａ-ｚ（）　’（）＋－，．／：？]*$/;

        this.$td.find('input[type="text"]').bind('blur', function () {
            h2z($(this), self.isKana);
            self.validate();
        });
    };
    ValAddress1.prototype.validate = function () {
        var i, l;

        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid1.hide();
            this.$errorMessageInvalid2.hide();
            this.$errorMessageInvalid3.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
        }
        else {
            if (this.isKana) {
                if (!this.$input.val().match(this.regExp)) {
                    this.$errorMessageInvalid1.show();
                }
            }
            else if (containsHankaku(this.$input.val())) {
                this.$errorMessageInvalid1.show();
            }
        }

        for (i = 0, l = this.optionals.length; i < l; i += 1) {
            if (this.isKana) {
                if (this.optionals[i].value && !this.optionals[i].value.match(this.regExp)) {
                    this['$errorMessageInvalid' + (i + 2)].show();
                }
            }
            else {
                if (containsHankaku(this.optionals[i].value)) {
                    this['$errorMessageInvalid' + (i + 2)].show();
                }
            }
        }

    };
    ValAddress1.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var i, l;

        //h2z(this.$input, this.isKana);

        for (i = 0, l = this.optionals.length; i < l; i += 1) {
            //h2z($(this.optionals[i]), this.isKana);
        }

        if (!this.$input.val()) {
            return false;
        }

        if (this.isKana) {
            if (!this.$input.val().match(this.regExp)) {
                return false;
            }
        }
        else {
            if (containsHankaku(this.$input.val())) {
                return false;
            }
        }

        for (i = 0, l = this.optionals.length; i < l; i += 1) {

            if (this.isKana) {
                if (!this.optionals[i].value.match(this.regExp)) {
                    return false;
                }
            }
            else {
                if (containsHankaku(this.optionals[i].value)) {
                    return false;
                }
            }
        }

        return true;
    };
    window.ValAddress1 = ValAddress1;


    /**
     * 電話番号
     */
    var ValTel = function (td, name, isOptional) {
        this.$td = $(td);
        this.isOptional = isOptional;
        this.init(name);
    };
    ValTel.prototype = new StartStop();
    ValTel.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$inputs = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$inputs.bind('blur', function () {
            if (!self.validated) {
                z2h($(this));
                return;
            }

            self.validate();
        });
    };
    ValTel.prototype.validate = function () {
        var self = this,
        i, l;

        this.validated = true;
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (self.isOptional) {
            this.$errorMessageInvalid.show();
            return;
        }

        for (i = 0, l = this.$inputs.length; i < l; i += 1) {
            if (!this.$inputs[i].value) {
                this.$errorMessageEmpty.show();
                return;
            }

            if (!this.$inputs[i].value.match(/^\d*$/)) {
                this.$errorMessageInvalid.show();
                return;
            }
        }
    };
    ValTel.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var self = this,
        result = true,
        allEmpty = true;

        if (this.isStopped) {
            return true;
        }

        this.$inputs.each(function () {
            z2h($(this));
            if ((!this.value) || !this.value.match(/^\d*$/)) {
                result = false;
            }
        });

        if (!result && this.isOptional) {
            this.$inputs.each(function () {
                if (this.value) {
                    allEmpty = false;
                }
            });

            if (allEmpty) {
                result = true;
            }
        }

        return result;
    };
    window.ValTel = ValTel;


    /**
     * notice-aの診察・検査…の
     */
    var ValNoticeA2 = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValNoticeA2.prototype = new StartStop();
    ValNoticeA2.prototype.init = function () {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$inputs = this.$td.find('input');
        this.$errorMessageSelect = createErrorMessage(this.$td, '診察・検査・治療・投薬の期間を選択してください。');
        this.$errorMessageEmpty = createErrorMessage(this.$td, '通院回数を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, '通院回数を正しく入力してください。');

        this.$selects = this.$td.find('select');
        this.$text = this.$td.find('input[type="text"]');
        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });

        this.$text.bind('blur', function () {
            z2h($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            if (!self.$text.val() || self.$text.val().match(/^\d+$/)) {
                self.$td.removeClass('error');
                self.$errorMessageEmpty.hide();
                self.$errorMessageInvalid.hide();
            }
            else {
                self.$td.addClass('error');
                self.$errorMessageInvalid.show();
            }
        });
    };
    ValNoticeA2.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageSelect) {
            this.$errorMessageSelect.hide();
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        this.validateSelect();
        this.validateText();
    };
    ValNoticeA2.prototype.validateSelect = function () {
        var allSelected = true;

        this.$selects.each(function () {
            if (!this.value) {
                allSelected = false;
            }
        });

        if (!allSelected) {
            this.$errorMessageSelect.show();
        }
    };
    ValNoticeA2.prototype.validateText = function () {
        if (!this.$text.val()) {
            this.$errorMessageEmpty.show();
            return false;
        }
        else if (!this.$text.val().match(/^\d+$/)) {
            this.$errorMessageInvalid.show();
            return false;
        }

        return true;
    };
    ValNoticeA2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var result = true;

        this.$selects.each(function () {
            if (!this.value) {
                result = false;
            }
        });

        if (!this.$text.val() || !this.$text.val().match(/^\d+$/)) {
            result = false;
        }

        return result;
    };
    ValNoticeA2.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$selects.find('option').each(function () {
            if (!this.value) {
                this.selected = 'selected';
            }
        });
        this.$text.val('');
    };
    window.ValNoticeA2 = ValNoticeA2;


    /**
     * notice-aの現在の状況の
     */
    var ValNoticeA3 = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValNoticeA3.prototype = new StartStop();
    ValNoticeA3.prototype.init = function () {
        var self = this,
        firstRadio = this.$td.find('input[type="radio"]')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$radios = this.$td.find('input[type="radio"]');
        this.$selects = this.$td.find('select');
        this.validated = false;
        this.$errorMessageRadio = createErrorMessage(this.$td, '現在の状況を選択してください。');
        this.$errorMessageSelect = createErrorMessage(this.$td, '完治した時期を入力してください。');

        this.$radios.click(function () {
            checkRadio.call(this);
        });
        this.$radios.each(function () {
            if (this.checked) {
                checkRadio.call(this);
            }
        });
        if (!this.$td.find('input[type="radio"]:checked')[0]) {
            this.$selects.attr('disabled', 'disabled');
        }


        function checkRadio() {
            if (this == firstRadio) {
                self.$selects.removeAttr('disabled');
            }
            else {
                self.$selects.attr('disabled', 'disabled');
                self.$selects[0].selectedIndex = self.$selects[0].options.length - 1;
                self.$selects[1].selectedIndex = 0;
            }

            if (self.validated) {
                self.validate();
            }
        }

        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });
    };
    ValNoticeA3.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageSelect.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$td.find('input[type="radio"]:checked').length === 0) {
            this.$errorMessageRadio.show();
            return;
        }

        this.$errorMessageSelect.show();
    };
    ValNoticeA3.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var result = true;

        if (this.$td.find('input[type="radio"]:checked').length === 0) {
            return false;
        }

        if (this.$td.find(':checked')[0] != this.$td.find('input[type="radio"]:first')[0]) {
            return true;
        }

        this.$selects.each(function () {
            if (!$(this).find(':selected').val()) {
                result = false;
            }
        });

        return result;
    };
    ValNoticeA3.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$radios.removeAttr('checked');
        this.$selects.find('option').each(function () {
            if (!this.value) {
                this.selected = 'selected';
            }
        });
        this.$selects.attr('disabled', 'disabled');
    };
    window.ValNoticeA3 = ValNoticeA3;


    /**
     * input全角縛り
     */
    var ValFull = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValFull.prototype = new StartStop();
    ValFull.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');

        if (!this.$input[0]) {
            this.$input = this.$td.find('textarea');
        }

        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$input.bind('blur', function () {
            self.validate();
        });
    };
    ValFull.prototype.validate = function () {
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
            return;
        }

        this.$errorMessageInvalid.show();
    };
    ValFull.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        h2z(this.$input);
        return (this.$input.val().length && !containsHankaku(this.$input.val()));
    };
    ValFull.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$input.val('');
    };
    window.ValFull = ValFull;


    /**
     * 告知書Phase2 追加 input全角縛り(ブランクチェック無し) yanaka
     */
    var ValFull2 = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValFull2.prototype = new StartStop();
    ValFull2.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');

        if (!this.$input[0]) {
            this.$input = this.$td.find('textarea');
        }

        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$input.bind('blur', function () {
            self.validate();
        });
    };
    ValFull2.prototype.validate = function () {
        if (this.$errorMessageInvalid) {
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        this.$errorMessageInvalid.show();
    };
    ValFull2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        h2z(this.$input);
        return (!containsHankaku(this.$input.val()));
    };
    ValFull2.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$input.val('');
    };
    window.ValFull2 = ValFull2;



    /**
     * notice-aの入院の
     */
    var ValNoticeA5 = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValNoticeA5.prototype = new StartStop();
    ValNoticeA5.prototype.init = function () {
        var self = this,
        checkedRadio = this.$td.find('input[type="radio"]:checked')[0],
        lastRadio = this.$td.find('input[type="radio"]:last')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$errorMessageRadio = createErrorMessage(this.$td, '入院した期間を選択してください。');
        this.$errorMessageSelect = createErrorMessage(this.$td, '入院した期間を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, '入院した期間を正しく入力してください。');
        this.$radios = this.$td.find('input[type="radio"]');
        this.$selects = this.$td.find('select');
        this.$text = this.$td.find('input[type="text"]');

        if (!checkedRadio || checkedRadio != lastRadio) {
            this.$selects.attr('disabled', 'disabled');
            this.$text.attr('disabled', 'disabled');
        }

        this.$radios.click(function () {
            radioCheck.call(this);
        });
        this.$radios.each(function () {
            if (this.checked) {
                radioCheck.call(this);
            }
        });

        function radioCheck() {
            if (this != lastRadio) {
                self.$selects.attr('disabled', 'disabled');
                self.$text.attr('disabled', 'disabled');
                self.$selects[0].selectedIndex = self.$selects[0].options.length - 1;
                self.$selects[1].selectedIndex = 0;
                self.$text.val('');
            }
            else {
                self.$selects.removeAttr('disabled');
                self.$text.removeAttr('disabled');
            }

            if (self.validated) {
                self.validate();
            }
        }

        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });

        this.$text.bind('blur', function () {
            z2h($(this));
            if (self.validated) {
                self.validate();
            }
        });
    };
    ValNoticeA5.prototype.validate = function () {
        this.validated = true;
        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageSelect.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$td.find('input[type="radio"]:checked').length === 0) {
            this.$errorMessageRadio.show();
            return;
        }

        if (this.$text.val() && !this.$text.val().match(/^\d+$/)) {
            this.$errorMessageInvalid.show();
            return;
        }

        this.$errorMessageSelect.show();
    };
    ValNoticeA5.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var $checked = this.$td.find('input[type="radio"]:checked'),
        selectedAll = true,
        selecteds = this.$selects.find(':selected'),
        i, l;

        if ($checked.length === 0) {
            return false;
        }

        if ($checked[0] === this.$td.find('input[type="radio"]:first')[0]) {
            return true;
        }

        for (i = 0, l = selecteds.length; i < l; i += 1) {
            if (!selecteds[i].value) {
                selectedAll = false;
            }
        }

        if (!selectedAll) {
            return false;
        }

        z2h(this.$text);

        return (this.$text.val() && this.$text.val().match(/^\d+$/));
    };
    ValNoticeA5.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.validated = false;
        this.$radios.removeAttr('checked');
        this.$selects.find('[value=""]').attr('selected', 'selected');
        this.$selects.attr('disabled', 'disabled');
        this.$text.val('');

    };
    window.ValNoticeA5 = ValNoticeA5;


    /**
     * notice-aの手術名の、notice-bでも使う
     */
    var ValNoticeA6 = function (td, name1, name2, name3, name4) {
        this.$td = $(td);
        this.init(name1, name2, name3, name4);
    };
    ValNoticeA6.prototype = new StartStop();
    ValNoticeA6.prototype.init = function (name1, name2, name3, name4) {
        var self = this,
        checkedRadio = this.$td.find('input[type="radio"]:checked')[0],
        firstRadio = this.$td.find('input[type="radio"]:first')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$errorMessageRadio = createErrorMessage(this.$td, name1 + 'を選択してください。');
        this.$errorMessageText1 = createErrorMessage(this.$td, name2 + 'を入力してください。');
        this.$errorMessageInvalid1 = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$errorMessageText2 = createErrorMessage(this.$td, name3 + 'を入力してください。');
        this.$errorMessageInvalid2 = createErrorMessage(this.$td, name3 + 'を正しく入力してください。');
        this.$errorMessageSelect = createErrorMessage(this.$td, name4 + 'を入力してください。');
        this.$radios = this.$td.find('input[type="radio"]');
        this.$text1 = this.$td.find('input[type="text"]:first');
        this.$text2 = this.$td.find('input[type="text"]:last');
        this.$selects = this.$td.find('select');
        this.$texts = this.$td.find('input[type="text"]');

        if (!checkedRadio || checkedRadio == firstRadio) {
            this.$selects.attr('disabled', 'disabled');
            this.$texts.attr('disabled', 'disabled');
        }

        this.$radios.click(function () {
            radioCheck.call(this);
        });
        this.$radios.each(function () {
            if (this.checked) {
                radioCheck.call(this);
            }
        });

        function radioCheck() {
            if (this === firstRadio) {
                self.$selects.attr('disabled', 'disabled');
                self.$texts.attr('disabled', 'disabled');
                self.$selects[0].selectedIndex = self.$selects[0].options.length - 1;
                self.$selects[1].selectedIndex = 0;
                self.$texts.val('');
            }
            else {
                self.$selects.removeAttr('disabled');
                self.$texts.removeAttr('disabled');
            }

            if (self.validated) {
                self.validate();
            }
        }

        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });

        this.$text1.bind('blur', function () {
            h2z($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText1.hide();
            self.$errorMessageInvalid1.hide();

            if (!this.value) {
                self.$errorMessageText1.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(this.value)) {
                self.$errorMessageInvalid1.show();
                self.$td.addClass('error');
            }
            else {
                if (self.$errorMessageText2.css('display') === 'none' &&
                    self.$errorMessageInvalid2.css('display') === 'none') {
                    self.$td.removeClass('error');
                }
            }
        });

        this.$text2.bind('blur', function () {
            h2z($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText2.hide();
            self.$errorMessageInvalid2.hide();

            if (!this.value) {
                self.$errorMessageText2.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(this.value)) {
                self.$errorMessageInvalid2.show();
                self.$td.addClass('error');
            }
            else {
                if (self.$errorMessageText1.css('display') === 'none' &&
                    self.$errorMessageInvalid1.css('display') === 'none') {
                    self.$td.removeClass('error');
                }
            }
        });
    };
    ValNoticeA6.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageText1.hide();
            this.$errorMessageText2.hide();
            this.$errorMessageInvalid1.hide();
            this.$errorMessageInvalid2.hide();
            this.$errorMessageSelect.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$td.find('input[type="radio"]:checked').length === 0) {
            this.$errorMessageRadio.show();
            return;
        }

        if (!this.$text1.val()) {
            this.$errorMessageText1.show();
            return;
        }
        else if (containsHankaku(this.$text1.val())) {
            this.$errorMessageInvalid1.show();
            return;
        }

        if (!this.$text2.val()) {
            this.$errorMessageText2.show();
            return;
        }
        else if (containsHankaku(this.$text2.val())) {
            this.$errorMessageInvalid2.show();
            return;
        }

        this.$errorMessageSelect.show();
    };
    ValNoticeA6.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var $checked = this.$td.find('input[type="radio"]:checked'),
        selectedAll = true,
        selecteds = this.$selects.find(':selected'),
        i, l;

        if ($checked.length === 0) {
            return false;
        }


        if ($checked[0] === this.$td.find('input[type="radio"]:first')[0]) {
            return true;
        }

        for (i = 0, l = selecteds.length; i < l; i += 1) {
            if (!selecteds[i].value) {
                selectedAll = false;
            }
        }

        if (!selectedAll) {
            return false;
        }

        return (this.$text1.val() && !containsHankaku(this.$text1.val()) &&
                this.$text2.val() && !containsHankaku(this.$text2.val()));
    };
    ValNoticeA6.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$radios.removeAttr('checked');
        this.$texts.val('');
        this.$selects.find('[value=""]').attr('selected', 'selected');
        this.$texts.attr('disabled', 'disabled');
        this.$selects.attr('disabled', 'disabled');
    };
    window.ValNoticeA6 = ValNoticeA6;


    /**
     * ラジオボタン + セレクトボックス
     */
    var ValRadioSelect = function (td, name1, name2) {
        this.$td = $(td);
        this.init(name1, name2);
    };
    ValRadioSelect.prototype = new StartStop();
    ValRadioSelect.prototype.init = function (name1, name2) {
        var self = this,
        checkedRadio = this.$td.find('input[type="radio"]:checked')[0],
        lastRadio = this.$td.find('input[type="radio"]:last')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.$radios = this.$td.find('input[type="radio"]');
        this.$selects = this.$td.find('select');
        this.$errorMessageRadio = createErrorMessage(this.$td, name1 + 'を選択してください。');
        this.$errorMessageSelect = createErrorMessage(this.$td, name2 + 'を入力してください。');

        if (!checkedRadio || checkedRadio != lastRadio) {
            this.$selects.attr('disabled', 'disabled');
        }

        this.$radios.change(function () {
            if (this == lastRadio) {
                self.$selects.removeAttr('disabled');
            }
            else {
                self.$selects.attr('disabled', 'disabled');
                if (self.$selects.length == 2) {
                    self.$selects[0].selectedIndex = self.$selects[0].options.length - 1;
                    self.$selects[1].selectedIndex = 0;
                }
                else {
                    self.$selects[0].selectedIndex = 0;
                }
            }

            if (self.validated) {
                self.validate();
            }
        });

        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });

    };
    ValRadioSelect.prototype.validate = function () {
        var checkedRadio = this.$td.find('input[type="radio"]:checked')[0];

        this.validated = true;

        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageSelect.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!checkedRadio) {
            this.$errorMessageRadio.show();
            return;
        }

        this.$errorMessageSelect.show();
    };
    ValRadioSelect.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var checkedRadio = this.$td.find('input[type="radio"]:checked')[0],
        lastRadio = this.$td.find('input[type="radio"]:last')[0],
        allSelected = true;

        if (!checkedRadio) {
            return false;
        }

        if (checkedRadio != lastRadio) {
            return true;
        }

        this.$selects.each(function () {
            if (!$(this).find(':selected').val()) {
                allSelected = false;
            }
        });

        return allSelected;
    };
    ValRadioSelect.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$selects.find('option[value=""]').attr('selected', 'selected');
        this.$selects.attr('disabled', 'disabled');
        this.$radios.removeAttr('checked');
    };
    window.ValRadioSelect = ValRadioSelect;


    var ValCommon4 = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValCommon4.prototype = new StartStop();
    ValCommon4.prototype.init = function (name) {
        var self = this,
        names;

        if (this.$td.length === 0) {
            this.stop();
            return;
        }

        names = [this.$td.find('input[type="radio"]:first')[0].name, this.$td.find('input[type="radio"]:last')[0].name];

        this.validated = false;
        this.$radio1 = this.$td.find('input[name="' + names[0] + '"]');
        this.$radio2 = this.$td.find('input[name="' + names[1] + '"]');
        this.$text = this.$td.find('input[type="text"]');
        this.$errorMessageRadio1 = createErrorMessage(this.$td, name + 'を選択してください。');
        this.$errorMessageText1 = createErrorMessage(this.$td, '金額合計を入力してください。');
        this.$errorMessageText2 = createErrorMessage(this.$td, '金額合計を正しく入力してください。');
        this.$errorMessageRadio2 = createErrorMessage(this.$td, '継続の有無を選択してください。');

        this.$radio1.click(function () {
            radioCheck1.call(this);

            if (self.validated) {
                self.validate();
            }
        });
        this.$radio2.click(function () {
            if (self.validated) {
                self.validate();
            }
        });


        this.$radio1.each(function () {
            if (this.checked) {
                radioCheck1.call(this);
            }
        });

        function radioCheck1() {
            if (this.checked && this.value === '1') {
                self.$text.removeAttr('disabled');
                self.$radio2.removeAttr('disabled');
            }
            else if (this.value === '0') {
                self.$text.attr('disabled', 'disabled');
                self.$radio2.attr('disabled', 'disabled');
                self.$radio2.removeAttr('checked');
                self.$text.val('');

                if (self.$errorMessageRadio1) {
                    self.$td.removeClass('error');
                    self.$errorMessageRadio1.hide();
                    self.$errorMessageText1.hide();
                    self.$errorMessageText2.hide();
                    self.$errorMessageRadio2.hide();
                }
            }
        }

        this.$text.bind('blur', function () {
            if (self.validated) {
                self.validate();
                return;
            }
            self.$errorMessageText1.hide();
            self.$errorMessageText2.hide();

            if (!this.value) {
                self.$td.addClass('error');
                self.$errorMessageText1.show();
            }
            else if (!this.value.match(/^[0-9]+$/)) {
                self.$td.addClass('error');
                self.$errorMessageText2.show();
            }
            else {
                self.$td.removeClass('error');
            }
        });
    };
    ValCommon4.prototype.validate = function () {
        this.validated = true;

        var checkedRadio = this.$td.find('input[type="radio"]:checked')[0];

        if (this.$errorMessageRadio1) {
            this.$errorMessageRadio1.hide();
            this.$errorMessageText1.hide();
            this.$errorMessageText2.hide();
            this.$errorMessageRadio2.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$radio1.filter(':checked').length === 0) {
            this.$errorMessageRadio1.show();
            return;
        }

        if (!this.$text.val()) {
            this.$errorMessageText1.show();
            return;
        }

        if (!this.$text.val().match(/^[0-9]+$/)) {
            this.$errorMessageText2.show();
            return;
        }

        this.$errorMessageRadio2.show();


    };
    ValCommon4.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var $checked = this.$radio1.filter(':checked');

        if ($checked.length === 0) {
            return false;
        }

        if ($checked.val() === '0') {
            return true;
        }

        if (!this.$text.val() || !this.$text.val().match(/^[0-9]+$/)) {
            return false;
        }

        $checked = this.$radio2.filter(':checked');
        return ($checked.length !== 0);
    };
    ValCommon4.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$selects.find('option[value=""]').attr('selected', 'selected');
        this.$selects.attr('disabled', 'disabled');
        this.$radios.removeAttr('checked');
    };
    window.ValCommon4 = ValCommon4;


    /**
     * notice-commonの職業欄
     */
    var ValCommon6 = function (td) {
        this.$td = $(td);
        this.init();
    };
    ValCommon6.prototype = new StartStop();
    ValCommon6.prototype.init = function () {
        var self = this,
        checkedRadio = this.$td.find('input[type="radio"]:checked"')[0],
        tradio1 = this.$td.find('div.js-job input[type="radio"]:last')[0],
        tradio2 = this.$td.find('div.js-not-job input[type="radio"]')[1];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.t1Active = false;
        this.t2Active = false;
        this.$radios = this.$td.find('input[type="radio"]');
        this.$t1 = this.$td.find('input[type="text"]:first');
        this.$t2 = this.$td.find('input[type="text"]:last');
        this.$errorMessageRadio = createErrorMessage(this.$td, 'ご職業を選択してください。');
        this.$errorMessageText1 = createErrorMessage(this.$td, 'その他を入力してください。');
        this.$errorMessageInvalid1 = createErrorMessage(this.$td, 'その他を正しく入力してください。');
        this.$errorMessageText2 = createErrorMessage(this.$td, '学校名を入力してください。');
        this.$errorMessageInvalid2 = createErrorMessage(this.$td, '学校名を正しく入力してください。');
        this.$t1.attr('disabled', 'disabled');
        this.$t2.attr('disabled', 'disabled');

        if (checkedRadio == tradio1) {
            this.$t1.removeAttr('disabled');
            this.t1Active = true;
        }

        if (checkedRadio == tradio2) {
            this.$t2.removeAttr('disabled');
            this.t2Active = true;
        }

        this.$radios.change(function () {
            self.$t1.attr('disabled', 'disabled');
            self.$t2.attr('disabled', 'disabled');
            self.t1Active = false;
            self.t2Active = false;

            if (this == tradio1) {
                self.$t1.removeAttr('disabled');
                self.t1Active = true;
            }
            self.$t1.val('');

            if (this == tradio2) {
                self.$t2.removeAttr('disabled');
                self.t2Active = true;
            }
            self.$t2.val('');

            if (self.validated) {
                self.validate();
            }
        });


        this.$td.find('input[type="text"]').blur(function () {
            h2z($(this));
            self.validate();
        });
    };
    ValCommon6.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageText1.hide();
            this.$errorMessageText2.hide();
            this.$errorMessageInvalid1.hide();
            this.$errorMessageInvalid2.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.t1Active) {
            if (this.$t1.val()) {
                this.$errorMessageInvalid1.show();
            }
            else {
                this.$errorMessageText1.show();
            }
        }
        else {
            if (this.$t2.val()) {
                this.$errorMessageInvalid2.show();
            }
            else {
                this.$errorMessageText2.show();
            }
        }
    };
    ValCommon6.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var checkedRadio = this.$td.find('input[type="radio"]:checked')[0];

        if (!checkedRadio) {
            return false;
        }

        if (this.t1Active) {
            return (this.$t1.val() && !containsHankaku(this.$t1.val())) ;
        }
        else if (this.t2Active) {
            return (this.$t2.val() && !containsHankaku(this.$t2.val()));
        }
        else {
            return true;
        }
    };
    window.ValCommon6 = ValCommon6;


    /**
     * notice-commonの法人格の、これだけtd二つで1クラス
     */
    var ValCommon78 = function (td1, td2) {
        this.$td = $(td1);
        this.$td1 = $(td1);
        this.$td2 = $(td2);
        this.init();
    };
    ValCommon78.prototype = new StartStop();
    ValCommon78.prototype.init = function () {
        var self = this,
        lastRadio = this.$td1.find('input[type="radio"]:last')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.validated = false;
        this.td2sleep = false;
        this.$radios1 = this.$td1.find('input[type="radio"]');
        this.$radios2 = this.$td2.find('input[type="radio"]');
        this.$text = this.$td2.find('input[type="text"]');
        this.$errorMessageRadio1 = createErrorMessage(this.$td, '法人格の位置を選択してください。');
        this.$errorMessageRadio2 = createErrorMessage(this.$td2, '法人格を選択してください。');
        this.$errorMessageText = createErrorMessage(this.$td2, 'その他を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td2, 'その他を正しく入力してください。');

        if (this.$td1.find('input[type="radio"]:checked')[0] == lastRadio) {
            this.td2sleep = true;
            this.sleep();
        }

        this.$radios1.change(function () {
            self.td2sleep = (this == lastRadio);
            self.sleep();
            if (self.validated) {
                self.validate();
            }
        });

        this.$radios2.change(function () {
            checkRadio2.call(this);
            self.$errorMessageText.hide();
            self.$errorMessageInvalid.hide();
            self.$td2.removeClass('error');
            if (self.validated) {
                self.validate();
            }
        }).each(function () {
            if (this.checked) {
                checkRadio2.call(this);
            }
        });

        this.$text.blur(function () {
            h2z($(this));

            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText.hide();
            self.$errorMessageInvalid.hide();
            self.$td2.addClass('error');

            if (!this.value) {
                self.$errorMessageText.show();
                return;
            }

            if (containsHankaku(this.value)) {
                self.$errorMessageInvalid.show();
                return;
            }

            self.$td2.removeClass('error');
        });

        function checkRadio2() {
            if (this === self.$radios2[self.$radios2.length - 1]) {
                self.$text.removeAttr('disabled');
            }
            else {
                self.$text.val('');
                self.$text.attr('disabled', 'disabled');
            }
        }
    };
    ValCommon78.prototype.sleep = function () {
        if (this.td2sleep) {
            this.$radios2.removeAttr('checked');
            this.$radios2.attr('disabled', 'disabled');
            this.$text.val('');
            this.$text.attr('disabled', 'disabled');
            this.$td2.removeClass('error');
            this.$errorMessageRadio2.hide();
            this.$errorMessageText.hide();
        }
        else {
            this.$radios2.removeAttr('disabled');
        }
    };
    ValCommon78.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageRadio1) {
            this.$errorMessageRadio1.hide();
            this.$errorMessageRadio2.hide();
            this.$errorMessageText.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid1()) {
            this.$td1.removeClass('error');
        }
        else {
            this.$td1.addClass('error');
            this.$errorMessageRadio1.show();
        }

        if (this.isValid2()) {
            this.$td2.removeClass('error');
        }
        else {
            this.$td2.addClass('error');
            if (!this.$td2.find('input[type="radio"]:checked')[0]) {
                this.$errorMessageRadio2.show();
            }
            else {
                if (this.$text.val()) {
                    this.$errorMessageInvalid.show();
                }
                else {
                    this.$errorMessageText.show();
                }
            }
        }
    };
    ValCommon78.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        return this.isValid1() && this.isValid2();
    };
    ValCommon78.prototype.isValid1 = function () {
        if (this.isStopped) {
            return true;
        }

        return this.$td1.find('input[type="radio"]:checked"')[0];
    };
    ValCommon78.prototype.isValid2 = function () {
        if (this.isStopped) {
            return true;
        }

        var checked = this.$td2.find('input[type="radio"]:checked')[0],
        last = this.$td2.find('input[type="radio"]:last')[0];

        if (this.td2sleep) {
            return true;
        }

        if (!checked) {
            return false;
        }

        if (checked != last) {
            return true;
        }

        return (this.$text.val() && !containsHankaku(this.$text.val()));
    };
    ValCommon78.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.validated = false;
        this.$td1.find('input').removeAttr('checked');
        this.$td2.find('input[type="radio"]').removeAttr('checked');
        this.$td2.find('input[type="text"]').val('');
        this.$radios2.removeAttr('disabled');
        this.$text.attr('disabled', 'disabled');
    };
    window.ValCommon78 = ValCommon78;


    /**
     * クレジットのアンケートradio
     */
    var ValCreditEnquete = function (table) {
        this.$td = $(table);
        this.init();
    };
    ValCreditEnquete.prototype = new StartStop();
    ValCreditEnquete.prototype.init = function () {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');

        this.$input.click(function () {
            if (self.validated) {
                self.validate();
            }
        });
    };
    ValCreditEnquete.prototype.validate = function () {
        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
    };

    ValCreditEnquete.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        this.validated = true;

        if (this.$td.find(':checked').length === 0) {
            return false;
        }

        return true;
    };
    window.ValCreditEnquete = ValCreditEnquete;




    /**
     * メールアドレス縛り
     */
    var ValMail = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValMail.prototype = new StartStop();
    ValMail.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$td.find('input').bind('blur', function () {
            self.validate();
        });
    };
    ValMail.prototype.validate = function () {
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');
        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
            return;
        }
        else {
            this.$errorMessageInvalid.show();
            return;
        }
    };
    ValMail.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var value = this.$input.val();

        return (value && value.match(/^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))+)))$/));
    };
    window.ValMail = ValMail;


    var ValLimit = function (td, name, min, max, isID) {
        this.$td = $(td);
        this.isID = !!isID;
        this.init(name, min, max);
    };
    ValLimit.prototype = new StartStop();
    ValLimit.prototype.init = function (name, min, max) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.min = min;
        this.$input = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を' + min + '文字以上' + max + '文字以内で入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$td.find('input').bind('blur', function () {
            self.validate();
        });
    };
    ValLimit.prototype.validate = function () {
        var value = this.$input.val();

        this.$errorMessageEmpty.hide();
        this.$errorMessageInvalid.hide();

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!value || value.length < this.min) {
            this.$errorMessageEmpty.show();
            return;
        }
        else {
            this.$errorMessageInvalid.show();
        }
    };
    ValLimit.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var value = this.$input.val();

        if (this.isID) {
            return (value && value.length >= this.min && value.match(/^[a-zA-Z0-9#\$\-=\?@\[\]_ ]+$/));
        }
        else {
            return (value && value.length >= this.min && value.match(/^[a-zA-Z0-9]+$/));
        }
    };
    window.ValLimit = ValLimit;


    /**
     * 別のフォームと同じ値になっているか
     */
    var ValSame = function (td, name, td2) {
        this.$td = $(td);
        this.$td2 = $(td2);
        this.init(name);
    };
    ValSame.prototype = new StartStop();
    ValSame.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$td.find('input').bind('blur', function () {
            self.validate();
        });
    };
    ValSame.prototype.validate = function () {
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
        }
        else {
            this.$errorMessageInvalid.show();
        }
    };
    ValSame.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var value = this.$input.val();

        return (value && value == this.$td2.find('input').val());
    };
    window.ValSame = ValSame;


    /**
     * 英数字縛り
     */
    var ValAlphaNum = function (td, name) {
        this.$td = $(td);
        this.init(name);
    };
    ValAlphaNum.prototype = new StartStop();
    ValAlphaNum.prototype.init = function (name) {
        var self = this;

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$input = this.$td.find('input');
        this.$errorMessageEmpty = createErrorMessage(this.$td, name + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name + 'を正しく入力してください。');
        this.$td.find('input').bind('blur', function () {
            self.validate();
        });
    };
    ValAlphaNum.prototype.validate = function () {
        if (this.$errorMessageEmpty) {
            this.$errorMessageEmpty.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (!this.$input.val()) {
            this.$errorMessageEmpty.show();
        }
        else {
            this.$errorMessageInvalid.show();
        }

    };
    ValAlphaNum.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var value = this.$input.val();

        return (value && value.match(/^[a-zA-Z0-9]+$/));
    };
    window.ValAlphaNum = ValAlphaNum;

//告知Phase2 暫定追加 Start
    /**
     * notice-b 検査の結果・所見・判定
     */
    var ValNoticeB1 = function (td, name1, name2) {
        this.$td = $(td);
        this.init(name1, name2);
    };

    ValNoticeB1.prototype = new StartStop();

    ValNoticeB1.prototype.init = function (name1, name2) {
        var self = this,
        $lastRadio = this.$td.find('input[type="radio"]:last')[0],
        selectedValue = this.$td.find(':checked').val();

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        this.$errorMessageSelect = createErrorMessage(this.$td, name1 + 'を選択してください。');
        this.$errorMessageText = createErrorMessage(this.$td, name2 + 'を入力してください。');
        this.$errorMessageInvalid = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$radios = this.$td.find('input[type="radio"]');
        this.$text = this.$td.find('input[type="text"]');


        this.$radios.click(function () {
            checkRadio.call(this);
        });

        this.$radios.each(function () {
            if (this.checked) {
                checkRadio.call(this);
            }
        });


        function checkRadio() {
            self.$text.removeAttr('disabled');
            if (self.isValidated && self.$td.hasClass('error')) {
                self.validate();
            }
        }

        this.$text.bind('blur', function () {
            h2z($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText.hide();
            self.$errorMessageInvalid.hide();

            if (!this.value) {
                self.$errorMessageText.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(this.value)) {
                self.$errorMessageInvalid.show();
                self.$td.addClass('error');
            }
            else {
                    self.$td.removeClass('error');
            }
        });

    };
    ValNoticeB1.prototype.validate = function () {
        this.isValidated = true;

        if (this.$errorMessageSelect) {
            this.$errorMessageSelect.hide();
            this.$errorMessageText.hide();
            this.$errorMessageInvalid.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return true;
        }

        this.$td.addClass('error');

        if (!this.$td.find(':checked').val()) {
            this.$errorMessageSelect.show();
            return false;
        }

        if (!this.$text.val()) {
            this.$errorMessageText.show();
        }
        else if (containsHankaku(this.$text.val())) {
            this.$errorMessageInvalid.show();
        }

        return false;
    };
    ValNoticeB1.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var selectedValue;

        selectedValue = this.$td.find(':checked').val();

        if (!selectedValue) {
            return false;
        }

        if (this.$td.find(':checked')[0] != this.$td.find('input[type="radio"]:last')[0]) {
            return true;
        }

        h2z(this.$text);

        return (this.$text.val() && !containsHankaku(this.$text.val()));
    };
    ValNoticeB1.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.validated = false;
        this.$radios.removeAttr('checked');
        this.$text.val('');
    };
    window.ValNoticeB1 = ValNoticeB1;
//告知Phase2 暫定追加 End

//告知Phase2 暫定追加 Start
//→yanaka mod 0613
    /**
     * notice-b 再検査・精密検査の有無
     */
    var ValNoticeB2 = function (td, name1, name2, name3, name3r, name4) {
        this.$td = $(td);
        this.init(name1, name2, name3, name3r, name4);
    };
    ValNoticeB2.prototype = new StartStop();
    ValNoticeB2.prototype.init = function (name1, name2, name3, name3r, name4) {
        var self = this,
        names,
        checkedRadio,
        firstRadio;
//        checkedRadio = this.$td.find('input[type="radio"]:checked')[0],
//        firstRadio = this.$td.find('input[type="radio"]:first')[0];

        if (this.$td.length == 0) {
            this.stop();
            return;
        }

        names = [this.$td.find('input[type="radio"]:first')[0].name, this.$td.find('input[type="radio"]:last')[0].name];
        checkedRadio = this.$td.find('input[name="' + names[0] + '"]:checked')[0],
        firstRadio = this.$td.find('input[name="' + names[0] + '"]:first')[0];

        this.validated = false;
        this.$errorMessageRadio = createErrorMessage(this.$td, name1 + 'を選択してください。');
        this.$errorMessageText1 = createErrorMessage(this.$td, name2 + 'を入力してください。');
        this.$errorMessageInvalid1 = createErrorMessage(this.$td, name2 + 'を正しく入力してください。');
        this.$errorMessageText2 = createErrorMessage(this.$td, name3 + 'を入力してください。');
        this.$errorMessageInvalid2 = createErrorMessage(this.$td, name3 + 'を正しく入力してください。');
        this.$errorMessageSelect = createErrorMessage(this.$td, name4 + 'を入力してください。');
        this.$errorMessageRadio2 = createErrorMessage(this.$td, name3r + 'を選択してください。');

        this.$radios = this.$td.find('input[name="' + names[0] + '"]');
        this.$radios2 = this.$td.find('input[name="' + names[1] + '"]');

//        this.$radios = this.$td.find('input[type="radio"]');

        this.$text1 = this.$td.find('input[type="text"]:first');
        this.$text2 = this.$td.find('input[type="text"]:last');
        this.$selects = this.$td.find('select');
        this.$texts = this.$td.find('input[type="text"]');

        if (!checkedRadio || checkedRadio == firstRadio) {
            this.$selects.attr('disabled', 'disabled');
            this.$texts.attr('disabled', 'disabled');
            this.$radios2.attr('disabled', 'disabled');
            this.$radios2.removeAttr('checked');
        }

        this.$radios.click(function () {
            radioCheck.call(this);
        });
        this.$radios.each(function () {
            if (this.checked) {
                radioCheck.call(this);
            }
        });

        function radioCheck() {
//            if (this === firstRadio) {
            if (this.checked && this.value === '0') {
                self.$selects.attr('disabled', 'disabled');
                self.$texts.attr('disabled', 'disabled');
                self.$selects[0].selectedIndex = self.$selects[0].options.length - 1;
                self.$selects[1].selectedIndex = 0;
                self.$texts.val('');
                self.$radios2.attr('disabled', 'disabled');
                self.$radios2.removeAttr('checked');

            }
            else {
                self.$selects.removeAttr('disabled');
                self.$texts.removeAttr('disabled');
                self.$radios2.removeAttr('disabled');
            }

            if (self.validated) {
                self.validate();
            }
        }

        this.$selects.change(function () {
            if (self.validated) {
                self.validate();
            }
        });

        this.$text1.bind('blur', function () {
            h2z($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText1.hide();
            self.$errorMessageInvalid1.hide();

            if (!this.value) {
                self.$errorMessageText1.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(this.value)) {
                self.$errorMessageInvalid1.show();
                self.$td.addClass('error');
            }
            else {
                if (self.$errorMessageText2.css('display') === 'none' &&
                    self.$errorMessageInvalid2.css('display') === 'none') {
                    self.$td.removeClass('error');
                }
            }
        });

        this.$text2.bind('blur', function () {
            h2z($(this));
            if (self.validated) {
                self.validate();
                return;
            }

            self.$errorMessageText2.hide();
            self.$errorMessageInvalid2.hide();

            if (!this.value) {
                self.$errorMessageText2.show();
                self.$td.addClass('error');
            }
            else if (containsHankaku(this.value)) {
                self.$errorMessageInvalid2.show();
                self.$td.addClass('error');
            }
            else {
                if (self.$errorMessageText1.css('display') === 'none' &&
                    self.$errorMessageInvalid1.css('display') === 'none') {
                    self.$td.removeClass('error');
                }
            }
        });

        this.$radios2.click(function () {
 //           if (self.validated) {
                self.validate();
 //           }
        });

    };
    ValNoticeB2.prototype.validate = function () {
        this.validated = true;

        if (this.$errorMessageRadio) {
            this.$errorMessageRadio.hide();
            this.$errorMessageText1.hide();
            this.$errorMessageText2.hide();
            this.$errorMessageInvalid1.hide();
            this.$errorMessageInvalid2.hide();
            this.$errorMessageSelect.hide();
            this.$errorMessageRadio2.hide();
        }

        if (this.isValid()) {
            this.$td.removeClass('error');
            return;
        }

        this.$td.addClass('error');

        if (this.$td.find('input[type="radio"]:checked').length === 0) {
//        if (this.$td.find('input[name="' + names[0] + '"]:checked').length === 0) {
            this.$errorMessageRadio.show();
            return;
        }

//        this.$errorMessageSelect.show();

        if (!this.$text1.val()) {
            this.$errorMessageText1.show();
            return;
        }
        else if (containsHankaku(this.$text1.val())) {
            this.$errorMessageInvalid1.show();
            return;
        }

        if (!this.$text2.val()) {
            this.$errorMessageText2.show();
            return;
        }
        else if (containsHankaku(this.$text2.val())) {
            this.$errorMessageInvalid2.show();
            return;
        }


//        if (this.$td.find('input[name="' + names[1] + '"]:checked').length === 0) {
//        if (this.$td.find('input[type="radio"]:checked').length === 0) {
        if (this.$radios2.filter(':checked').length === 0) {
            this.$errorMessageRadio2.show();
            return;
        }

        this.$errorMessageSelect.show();

    };
    ValNoticeB2.prototype.isValid = function () {
        if (this.isStopped) {
            return true;
        }

        var
        //$checked = this.$td.find('input[type="radio"]:checked'),
        //var $checked = this.$td.find('input[name="' + names[0] + '"]:checked'),
        //$checked2 = this.$td.find('input[name="' + names[1] + '"]:checked'),
        //$checked2 = this.$td.find('input[type="radio"]:checked'),
        $checked = this.$radios.filter(':checked'),
        $checked2 = this.$radios2.filter(':checked'),
        selectedAll = true,
        selecteds = this.$selects.find(':selected'),
        i, l;

        for (i = 0, l = selecteds.length; i < l; i += 1) {
            if (!selecteds[i].value) {
                selectedAll = false;
            }
        }

        if ($checked.length === 0) {
            return false;
        }

        if ($checked[0] === this.$td.find('input[type="radio"]:first')[0]) {
        //if ($checked[0] === this.$td.find('input[name="' + names[0] + '"]:first')[0]) {
            return true;
        }


//        $checked2 = this.$radios2.filter(':checked');
        if ($checked2.length === 0) {
            return false;
        }
        //if ($checked2[0] === this.$td.find('input[name="' + names[1] + '"]:last')[0]) {
/*        if ($checked2[0] === this.$td.find('input[type="radio"]:last')[0]) {
            return true;
        }
*/
        if (!selectedAll) {
            return false;
        }

        return (this.$text1.val() && !containsHankaku(this.$text1.val()) &&
                this.$text2.val() && !containsHankaku(this.$text2.val()));
    };
    ValNoticeB2.prototype.reset = function () {
        if (this.$td.length === 0) {
            return;
        }

        this.$radios.removeAttr('checked');
        this.$texts.val('');
        this.$selects.find('[value=""]').attr('selected', 'selected');
        this.$texts.attr('disabled', 'disabled');
        this.$selects.attr('disabled', 'disabled');
        this.$radios2.attr('disabled', 'disabled');
        this.$radios2.removeAttr('checked');
    };
    window.ValNoticeB2 = ValNoticeB2;
//告知Phase2 暫定追加 End
})();

function h2z($input, convertLong) {
    var h = $input.val(), z;
    if (!h) {
        return;
    }
    z = h.replace(/(\w|\-)/g, function ($0) {
        if ($0 === '-') {
            return '－';
        }
        else if ($0 === ' ') {
            return '　';
        }
        return String.fromCharCode($0.charCodeAt(0) + 65248);
    });

    if (convertLong) {
        z = z.replace(/ー/g, '－');
    }

    $input.val(z);
}

function z2h($input) {
    var z = ($input.val) ? $input.val() : $input,
    h = z.replace(/([０-９])/g, function ($0) {
        return String.fromCharCode($0.charCodeAt(0) - 65248);
    });

    if ($input.val) {
        $input.val(h);
    }
    return h;
}

function convertLong($input) {
    var original = $input.val();
    $input.val(original.replace(/ー/g, '－'));
}

function containsHankaku (str) {
    var i, l, c;

    for (i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (!str.charAt(i) != "\n" && c < 0x81 || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            return true;
        }
    }

    return false;
}

function createErrorMessage($td, message) {
    var $result = $('<p>' + message + '</p>');
    $result.addClass('error_message');
    $td.append($result);
    $result.hide();
    return $result;
}

