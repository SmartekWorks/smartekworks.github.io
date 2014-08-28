/**
 * シミュレーションViewModel
 * @class SimulationViewModel
 * @constructor
 * @param app {Object} Webcas共通処理
 * @param styleHandler {Object} シミュレーション用スタイル制御オブジェクト
 * @param planData {Object} シミュレーション共通処理
 */
var SimulationViewModel = function(app, styleHandler, planData, constant) {
    var self = this;

    // 保険料計算対象フラグのカウント
    var isCalcTargetCount = 0;

    // vaildation無効フラグ
    var disableValidation = false;

    // 各商品の前回の値
    var bridgeVals = [[],[],[]];
    var FinesaveVals = [[],[],[]];
    var keepVals = [[],[],[]];
    var cureVals = [[],[],[]];
    var cureLadyVals = [[],[],[]];
    var reliefWVals = [[],[],[]];
    var believeVals = [[],[],[]];
    var cureSupportVals = [[],[],[]];
    var riseSupportVals = [[],[],[]];

    // 一時保存用の商品選択フラグ
    var tempIsSelectedBridge = false;
    var tempIsSelectedFineSave = false;
    var tempIsSelectedKeep = false;
    var tempIsSelectedCure = false;
    var tempIsSelectedCureLady = false;
    var tempIsSelectedReliefW = false;
    var tempIsSelectedBelieve = false;
    var tempIsSelectedCureSupport = false;
    var tempIsSelectedRiseSupport = false;
    // 全プラン再計算フラグ
    var isSelectPlanAll = false;

    self.sh = styleHandler; // スタイル制御オブジェクトへの参照（HTMLデータバインディングでsh.xxxで呼べるようにviewModelのメンバーとする）

    // ログインされているかどうか(検証用)(constはIEで使えない)
    self.IS_LOGIN = false;

    // 定数取得、設定
    self.constants = app.GetConstants().content

    // データ
    self.plan = ko.observable(planData);    // 保険料データ
    self.contract = ko.observable(planData.contract); // 契約者情報
    self.products = ko.observableArray(planData.products);

    self.index = ko.observable(planData.initializeProperty.index);  // シミュレーション画面種別
    self.okl = ko.observable(planData.initializeProperty.oKL); // 資料請求用キーライン
    self.ag = ko.observable(planData.initializeProperty.ag); // 代理店コード
    self.sl = ko.observable(planData.initializeProperty.sl); // 募集人コード
    self.genderCtl = ko.observable(planData.initializeProperty.genderctl); // 性別制御

    // 初回シミュレーションフラグ
    self.firstSimulation = ko.observable(true);

	// 一時保存用商品データ
	var tempProducts = [];

    // 全商品かどうか
    self.isFreePlan = ko.computed(function() {
        return (self.index() == '1') || (self.index() == '2') || (self.index() == '3');
    });

    // おすすめ商品かどうか
    self.isSelectPlan = ko.computed(function() {
        return (self.index() == '4') || (self.index() == '5') || (self.index() == '6');
    });

    // どのプランを選択しているか
    self.selectedPlan = ko.observable(planData.selectedPlan);

    // サーバの値が基本プランの場合、基本プランのフラグを立てる
    self.isSelectPlanBasic = ko.computed(function() {
        return self.selectedPlan() == 'basic';
    });

    // サーバの値が充実プランの場合、充実プランのフラグを立てる
    self.isSelectPlanRich = ko.computed(function() {
        return self.selectedPlan() == 'rich';
    });

    // 商品の選択数（おすすめ商品）
    self.selectedProductCount = ko.observable('0');

    self.paymentCount = ko.observable();    // 支払回数(m or h or y)

    // 契約年齢(検証用)
    self.contractAge = ko.computed(function() {
        var contractAge;
        switch (self.paymentCount()){
            case 'm':
                // 月払
                contractAge = self.plan().applyInfo.contractAge.a1;
                break;
            case 'h':
                // 半年払
                contractAge = self.plan().applyInfo.contractAge.a6;
                break;
            case 'y':
                // 年払
                contractAge = self.plan().applyInfo.contractAge.a12;
                break;
        }
        return contractAge;
    });

    // 誕生日が3か月以内かどうか
    self.showBirthdayPopup = ko.observable(false);

    // マスタデータ
    self.bridgeInsuranceAmount = ko.observableArray();                      // Bridge保険金額選択リスト(全商品)
    self.selectedBridgeInsuranceAmount = ko.observable();                   // 選択されたBridge保険金額(全商品)
    self.bridgeInsurancePeriod = ko.observableArray();                      // Bridge保険期間選択リスト(全商品)
    self.selectedBridgeInsurancePeriod = ko.observable();                   // 選択されたBridge保険期間(全商品)

    self.bridgeInsuranceAmountBasic = ko.observableArray();                 // Bridge保険金額選択リスト(基本プラン)
    self.selectedBridgeInsuranceAmountBasic = ko.observable();              // 選択されたBridge保険金額(基本プラン)
    self.bridgeInsurancePeriodBasic = ko.observableArray();                 // Bridge保険期間選択リスト(基本プラン)
    self.selectedBridgeInsurancePeriodBasic = ko.observable();              // 選択されたBridge保険期間(基本プラン)

    self.bridgeInsuranceAmountRich = ko.observableArray();                  // Bridge保険金額選択リスト（充実プラン）
    self.selectedBridgeInsuranceAmountRich = ko.observable();               // 選択されたBridge保険金額（充実プラン）
    self.bridgeInsurancePeriodRich = ko.observableArray();                  // Bridge保険期間選択リスト（充実プラン）
    self.selectedBridgeInsurancePeriodRich = ko.observable();               // 選択されたBridge保険期間（充実プラン）

    self.fineSaveInsuranceAmount = ko.observableArray();                    // FineSave保険金額選択リスト
    self.selectedFineSaveInsuranceAmount = ko.observable();                 // 選択されたFineSave保険金額
    self.fineSaveInsurancePeriod = ko.observableArray();                    // FineSave保険期間選択リスト
    self.selectedFineSaveInsurancePeriod = ko.observable();                 // 選択されたFineSave保険期間

    self.keepBenefitLumpPay = ko.observable();                              // Keep一括受取金額
    self.keepMonthlyPension = ko.observableArray();                         // Keep保険金額
    self.selectedKeepMonthlyPension = ko.observable();                      // 選択されたKeep保険金額
    self.keepPaymentGuaranteePeriodFlg1 = ko.observableArray();             // Keep支払保証期間1年のdisableフラグ
    self.keepPaymentGuaranteePeriodFlg2 = ko.observableArray();             // Keep支払保証期間5年のdisableフラグ
    self.selectedKeepPaymentGuaranteePeriod = ko.observable();              // 選択されたKeep支払保証期間
    self.keepInsurancePeriod = ko.observableArray();                        // Keep保険期間
    self.selectedKeepInsurancePeriod = ko.observable();                     // 選択されたKeep保険期間

    self.selectedCureHospitalAmount = ko.observable();                      // 選択されたCure入院給付金日額(全商品)
    self.selectedCureHospitalAmountDisable = ko.observable(false);          // 選択されたCure入院給付金日額のdisableフラグ(全商品)
    self.selectedCureAdvancedMedical = ko.observable();                     // 選択されたCure先進医療特約(全商品)
    self.hideCureAdvancedMedical = ko.observable();                         // 隠されるCure先進医療特約(全商品)
    self.selectedCureCancerOption = ko.observable();                        // 選択されたCureがん診断治療給付金特約(全商品)
    self.selectedCureCancerOutpatient = ko.observable();                    // 選択されたCureがん通院特約(全商品)
    self.cureInsurancePaymentPeriod = ko.observableArray();                 // Cure保険料払込期間(全商品)
    self.selectedCureInsurancePaymentPeriod = ko.observable();              // 選択されたCure保険料払込期間(全商品)

    self.cureHospitalAmountBasic = ko.observableArray();                    // Cure入院給付金日額(基本プラン)
    self.selectedCureHospitalAmountBasic = ko.observable();                 // 選択されたCure入院給付金日額(基本プラン)
    self.selectedCureAdvancedMedicalBasic = ko.observable();                // 選択されたCure先進医療特約(基本プラン)
    self.hideCureAdvancedMedicalBasic = ko.observable();                    // 隠されるCure先進医療特約(基本プラン)
    self.selectedCureCancerOptionBasic = ko.observable();                   // 選択されたCureがん診断治療給付金特約(基本プラン)
    self.selectedCureCancerOutpatientBasic = ko.observable();               // 選択されたCureがん通院特約(基本プラン)
    self.cureInsurancePaymentPeriodBasic = ko.observableArray();            // Cure保険料払込期間(基本プラン)
    self.selectedCureInsurancePaymentPeriodBasic = ko.observable();         // 選択されたCure保険料払込期間(基本プラン)

    self.cureHospitalAmountRich = ko.observableArray();                     // Cure入院給付金日額(充実プラン)
    self.selectedCureHospitalAmountRich = ko.observable();                  // 選択されたCure入院給付金日額(充実プラン)
    self.selectedCureAdvancedMedicalRich = ko.observable();                 // 選択されたCure先進医療特約(充実プラン)
    self.hideCureAdvancedMedicalRich = ko.observable();                     // 隠されるCure先進医療特約(充実プラン)
    self.selectedCureCancerOptionRich = ko.observable();                    // 選択されたCureがん診断治療給付金特約(充実プラン)
    self.selectedCureCancerOutpatientRich = ko.observable();                // 選択されたCureがん通院特約(充実プラン)
    self.cureInsurancePaymentPeriodRich = ko.observableArray();             // Cure保険料払込期間(充実プラン)
    self.selectedCureInsurancePaymentPeriodRich = ko.observable();          // 選択されたCure保険料払込期間(充実プラン)

    self.selectedCureLadyHospitalAmount = ko.observable();                  // 選択されたCureLady入院給付金日額(全商品)
    self.selectedCureLadyHospitalAmountDisable = ko.observable(false);      // 選択されたCureLady入院給付金日額のdisableフラグ(全商品)
    self.selectedCureLadyAdvancedMedical = ko.observable();                 // 選択されたCureLady先進医療特約(全商品)
    self.hideCureLadyAdvancedMedical = ko.observable();                     // 隠されるCureLady先進医療特約(全商品)
    self.selectedCureLadyCancerOption = ko.observable();                    // 選択されたCureLadyがん診断治療給付金特約(全商品)
    self.selectedCureLadyCancerOutpatient = ko.observable();                // 選択されたCureLadyがん通院特約(全商品)
    self.cureLadyInsurancePaymentPeriod = ko.observableArray();             // CureLady保険料払込期間(全商品)
    self.selectedCureLadyInsurancePaymentPeriod = ko.observable();          // 選択されたCureLady保険料払込期間(全商品)

    self.cureLadyHospitalAmountBasic = ko.observableArray();                // CureLady入院給付金日額(基本プラン)
    self.selectedCureLadyHospitalAmountBasic = ko.observable();             // 選択されたCureLady入院給付金日額（基本プラン）
    self.selectedCureLadyAdvancedMedicalBasic = ko.observable();            // 選択されたCureLady先進医療特約（基本プラン）
    self.hideCureLadyAdvancedMedicalBasic = ko.observable();                // 隠されるCureLady先進医療特約（基本プラン）
    self.selectedCureLadyCancerOptionBasic = ko.observable();               // 選択されたCureLadyがん診断治療給付金特約（基本プラン）
    self.selectedCureLadyCancerOutpatientBasic = ko.observable();           // 選択されたCureLadyがん通院特約（基本プラン）
    self.cureLadyInsurancePaymentPeriodBasic = ko.observableArray();        // CureLady保険料払込期間（基本プラン）
    self.selectedCureLadyInsurancePaymentPeriodBasic = ko.observable();     // 選択されたCureLady保険料払込期間（基本プラン）

    self.cureLadyHospitalAmountRich = ko.observableArray();                 // CureLady入院給付金日額(充実プラン)
    self.selectedCureLadyHospitalAmountRich = ko.observable();              // 選択されたCureLady入院給付金日額（充実プラン）
    self.selectedCureLadyAdvancedMedicalRich = ko.observable();             // 選択されたCureLady先進医療特約（充実プラン）
    self.hideCureLadyAdvancedMedicalRich = ko.observable();                 // 隠されるCureLady先進医療特約（充実プラン）
    self.selectedCureLadyCancerOptionRich = ko.observable();                // 選択されたCureLadyがん診断治療給付金特約（充実プラン）
    self.selectedCureLadyCancerOutpatientRich = ko.observable();            // 選択されたCureLadyがん通院特約（充実プラン）
    self.cureLadyInsurancePaymentPeriodRich = ko.observableArray();         // CureLady保険料払込期間（充実プラン）
    self.selectedCureLadyInsurancePaymentPeriodRich = ko.observable();      // 選択されたCureLady保険料払込期間（充実プラン）

    self.selectedReliefWHospitalAmount = ko.observable();                   // 選択されたReliefW入院給付金日額
    self.selectedReliefWHospitalAmountDisable = ko.observable(false);       // 選択されたReliefW入院給付金日額のdisableフラグ
    self.selectedReliefWAdvancedMedical = ko.observable();                  // 選択されたReliefW先進医療特約
    self.hideReliefWAdvancedMedical = ko.observable();                      // 隠されるReliefW先進医療特約
    self.reliefWInsurancePaymentPeriod = ko.observableArray();              // ReliefW保険料払込期間
    self.selectedReliefWInsurancePaymentPeriod = ko.observable();           // 選択されたReliefW保険料払込期間

    self.selectedBelieveAmount = ko.observable();                           // 選択されたBelieve基本給付金額（全商品）
    self.selectedBelieveAmountDisable = ko.observable(false);               // 選択されたBelieve基本給付金額のdisableフラグ（全商品）
    self.selectedBelieveCancerAdvancedMedical = ko.observable();            // 選択されたBelieveがん先進医療特約（全商品）
    self.hideBelieveCancerAdvancedMedical = ko.observable();                // 隠されるBelieveがん先進医療特約（全商品）
    self.selectedBelieveCancerOutpatient = ko.observable();                 // 選択されたBelieveがん通院特約（全商品）
    self.believeInsurancePaymentPeriod = ko.observableArray();              // Believe保険料払込期間（全商品）
    self.selectedBelieveInsurancePaymentPeriod = ko.observable();           // 選択されたBelieve保険料払込期間（全商品）

    self.believeAmountBasic = ko.observableArray();                         // Believe基本給付金額（基本プラン）
    self.selectedBelieveAmountBasic = ko.observable();                      // 選択されたBelieve基本給付金額（基本プラン）
    self.selectedBelieveCancerAdvancedMedicalBasic = ko.observable();       // 選択されたBelieveがん先進医療特約（基本プラン）
    self.hideBelieveCancerAdvancedMedicalBasic = ko.observable();          　// 隠されるBelieveがん先進医療特約（基本プラン）
    self.selectedBelieveCancerOutpatientBasic = ko.observable();            // 選択されたBelieveがん通院特約（基本プラン）
    self.believeInsurancePaymentPeriodBasic = ko.observableArray();         // Believe保険料払込期間（基本プラン）
    self.selectedBelieveInsurancePaymentPeriodBasic = ko.observable();      // 選択されたBelieve保険料払込期間（基本プラン）

    self.believeAmountRich = ko.observableArray();                          // Believe基本給付金額（充実プラン）
    self.selectedBelieveAmountRich = ko.observable();                       // 選択されたBelieve基本給付金額（充実プラン）
    self.selectedBelieveCancerAdvancedMedicalRich = ko.observable();       　// 選択されたBelieveがん先進医療特約（充実プラン）
    self.hideBelieveCancerAdvancedMedicalRich = ko.observable();            // 隠されるBelieveがん先進医療特約（充実プラン）
    self.selectedBelieveCancerOutpatientRich = ko.observable();           　 // 選択されたBelieveがん通院特約（充実プラン）
    self.believeInsurancePaymentPeriodRich = ko.observableArray();          // Believe保険料払込期間（充実プラン）
    self.selectedBelieveInsurancePaymentPeriodRich = ko.observable();       // 選択されたBelieve保険料払込期間（充実プラン）

    self.selectedCureSupportHospitalAmount = ko.observable();               // 選択されたCureSupport入院給付金日額
    self.selectedCureSupportHospitalAmountDisable = ko.observable(false);   // 選択されたCureSupport入院給付金日額のdisableフラグ
    self.cureSupportRelaxationLifetimeInsurance = ko.observableArray();     // CureSupport引受基準緩和型終身保険特約
    self.selectedCureSupportRelaxationLifetimeInsurance = ko.observable();  // 選択されたCureSupport引受基準緩和型終身保険特約
    self.selectedCureSupportRelaxationAdvancedMedical = ko.observable();    // 選択されたCureSupport引受基準緩和型先進医療特約
    self.hideCureSupportRelaxationAdvancedMedical = ko.observable();        // 隠されるCureSupport引受基準緩和型先進医療特約

    self.riseSupportInsuranceAmount = ko.observableArray();                 // RiseSupport保険金額
    self.selectedRiseSupportInsuranceAmount = ko.observable();              // 選択されたRiseSupport保険金額

    // 商品選択、選択可否フラグ
    self.isSelectedBridge = ko.observable();           // Bridge選択フラグ
    self.selectableBridge = ko.observable(false);      // Bridge選択可否フラグ
    self.isSelectedKeep = ko.observable();             // Keep選択フラグ
    self.selectableKeep = ko.observable(false);        // Keep選択可否フラグ
    self.isSelectedFineSave = ko.observable();         // FineSave選択フラグ
    self.selectableFineSave = ko.observable(false);    // FineSave選択可否フラグ
    self.isSelectedCure = ko.observable();             // Cure選択フラグ
    self.selectableCure = ko.observable(false);        // Cure選択可否フラグ
    self.isSelectedCureLady = ko.observable();         // CureLady選択フラグ
    self.selectableCureLady = ko.observable(false);    // CureLady選択可否フラグ
    self.isSelectedReliefW = ko.observable();          // ReliefW選択フラグ
    self.selectableReliefW = ko.observable(false);     // ReliefW選択可否フラグ
    self.isSelectedBelieve = ko.observable();          // Believe選択フラグ
    self.selectableBelieve = ko.observable(false);     // Believe選択可否フラグ
    self.isSelectedCureSupport = ko.observable();      // CureSupport選択フラグ
    self.selectableCureSupport = ko.observable(false); // CureSupport選択可否フラグ
    self.isSelectedRiseSupport = ko.observable();      // RiseSupport選択フラグ
    self.selectableRiseSupport = ko.observable(false); // RiseSupport選択可否フラグ

    // フットガードの文言出しわけフラグ
    self.displayGurdFooter02 = ko.observable(); // id「gd-f02」の文言表示フラグ
    self.displayGurdFooter03 = ko.observable(); // id「gd-f03」の文言表示フラグ


    // 商品選択不可時のメッセージ
    self.bridgeDisableMessage = ko.observable("この商品は<br>お申込みできません。");    // Bridge選択不可時に表示するメッセージ
    self.keepDisableMessage = ko.observable("この商品は<br>お申込みできません。");      // Keep選択不可時に表示するメッセージ
    self.cureDisableMessage = ko.observable("この商品は<br>お申込みできません。");      // Cure選択不可時に表示するメッセージ
    self.cureLadyDisableMessage = ko.observable("この商品は<br>お申込みできません。");  // CureLady選択不可時に表示するメッセージ
    self.reliefWDisableMessage = ko.observable("この商品は<br>お申込みできません。"); 　 // ReliefW選択不可時に表示するメッセージ

    // CureSupport(終身保険特約付)であるか
    self.isSelectedCureSupportWithLifetimeInsurance = ko.computed(function() {
        return self.isSelectedCureSupport() && self.selectedCureSupportRelaxationLifetimeInsurance() > 0;
    });

    // 生年月日選択ダイアログ用
    self.birthdayYear = ko.observableArray(); // 生年月日ダイアログ(年)
    self.selectedBirthdayYear = ko.observable(); // 選択された生年月日(年)
    // 選択された生年月日の表示用テキスト
    self.selectedBirthdayYearText = ko.computed(function() {
        return $('#input-dialog-year').find('[value=' + self.selectedBirthdayYear() + ']').text();
    }, self);
    self.birthdayMonth = ko.observableArray(); // 生年月日ダイアログ(月)
    self.selectedBirthdayMonth = ko.observable(); // 選択された生年月日(月)
    self.birthdayDay = ko.observableArray(); // 生年月日ダイアログ(日)
    self.selectedBirthdayDay = ko.observable(); // 選択された生年月日(日)
    self.selectedGender = ko.observable(); // 選択された性別
    // 選択された性別の表示用テキスト
    self.selectedGenderText = ko.computed(function() {
        if (self.selectedGender() == '1') {
            return '男性';
        } else if (self.selectedGender() == '2') {
            return '女性';
        }
    }, self);
    // 選択された生年月日
    self.selectedBirthday = ko.computed(function() {
        return self.selectedBirthdayYear() + ('0' + self.selectedBirthdayMonth()).slice(-2) + ('0' + self.selectedBirthdayDay()).slice(-2);
    });

    // 各商品の保険料計算対象フラグ（全商品）
    self.isCalcTargetBridge = ko.observable(false);
    self.isCalcTargetFineSave = ko.observable(false);
    self.isCalcTargetKeep = ko.observable(false);
    self.isCalcTargetCure = ko.observable(false);
    self.isCalcTargetCureLady = ko.observable(false);
    self.isCalcTargetReliefW = ko.observable(false);
    self.isCalcTargetBelieve = ko.observable(false);
    self.isCalcTargetCureSupport = ko.observable(false);
    self.isCalcTargetRiseSupport = ko.observable(false);
    // 各商品の保険料計算対象フラグ（基本プラン）
    self.isCalcTargetBridgeBasic = ko.observable(false);
    self.isCalcTargetCureBasic = ko.observable(false);
    self.isCalcTargetCureLadyBasic = ko.observable(false);
    self.isCalcTargetBelieveBasic = ko.observable(false);
    // 各商品の保険料計算対象フラグ（充実プラン）
    self.isCalcTargetBridgeRich = ko.observable(false);
    self.isCalcTargetCureRich = ko.observable(false);
    self.isCalcTargetCureLadyRich = ko.observable(false);
    self.isCalcTargetBelieveRich = ko.observable(false);

    // メール送信中フラグ
    self.isSending = ko.observable(false);
    // メール送信ボタン押下フラグ
    self.isClickSendMailButton = ko.observable(false);
    // メールアドレスのテキストボックス
    self.mailAddress = ko.observable();
    // メール送信成功メッセージ
    self.sendMailSuccessMessage = ko.observable();
    // メール送信エラーメッセージ
    self.sendMailErrors = ko.observable();

    // シミュレーション中判定フラグ
    self.isExecuteSimulating = ko.observable(true);

    /**
     * Bridge選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedBridge
     */
    self.isSelectedBridge.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_check');
    });

    /**
     * FineSave選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedFineSave
     */
    self.isSelectedFineSave.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('fs_check');
    });
    
    /**
     * Keep選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedKeep
     */
    self.isSelectedKeep.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('keep_check');
    });

    /**
     * Cure選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedCure
     */
    self.isSelectedCure.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_check');
    });

    /**
     * CureLady選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedCureLady
     */
    self.isSelectedCureLady.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_check');
    });

    /**
     * ReliefW選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedReliefW
     */
    self.isSelectedReliefW.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('relief-w_check');
    });

    /**
     * Believe選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedBelieve
     */
    self.isSelectedBelieve.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_check');
    });

    /**
     * CureSupport選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedCureSupport
     */
    self.isSelectedCureSupport.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-s_check');
    });

    /**
     * RiseSupport選択フラグを、subscribeで即時に変更を受け取る
     * @method isSelectedRiseSupport
     */
    self.isSelectedRiseSupport.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('rise_check');
    });

    /**
     * 選択されたBridge保険金額（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsuranceAmount
     */
    self.selectedBridgeInsuranceAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_sum_insured');
    });

    /**
     * 選択されたBridge保険期間（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsurancePeriod
     */
    self.selectedBridgeInsurancePeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_term');
    });

    /**
     * 選択されたFineSave保険金額を、subscribeで即時に変更を受け取る
     * @method selectedFineSaveInsuranceAmount
     */
    self.selectedFineSaveInsuranceAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('fs_sum_insured');
    });

    /**
     * 選択されたFineSave保険期間を、subscribeで即時に変更を受け取る
     * @method selectedFineSaveInsurancePeriod
     */
    self.selectedFineSaveInsurancePeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('fs_term');
    });

    /**
     * 選択されたKeep保険金額を、subscribeで即時に変更を受け取る
     * @method selectedKeepMonthlyPension
     */
    self.selectedKeepMonthlyPension.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedKeepMonthlyPension()) {
            case '100000':
                self.validationForSubscribe('keep_benefit_1');
                break;
            case '150000':
                self.validationForSubscribe('keep_benefit_2');
                break;
            case '200000':
                self.validationForSubscribe('keep_benefit_3');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたKeep支払保証期間を、subscribeで即時に変更を受け取る
     * @method selectedKeepPaymentGuaranteePeriod
     */
    self.selectedKeepPaymentGuaranteePeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedKeepPaymentGuaranteePeriod()) {
            case 'ｷ':
                self.validationForSubscribe('keep_term_1');
                break;
            case 'ｸ':
                self.validationForSubscribe('keep_term_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたKeep保険期間を、subscribeで即時に変更を受け取る
     * @method selectedKeepInsurancePeriod
     */
    self.selectedKeepInsurancePeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('keep_period');
    });

    /**
     * 選択されたCure入院給付金日額を、subscribeで即時に変更を受け取る
     * @method selectedCureHospitalAmount
     */
    self.selectedCureHospitalAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureHospitalAmount()) {
            case '5000':
                self.validationForSubscribe('cure_benefit_1');
                break;
            case '10000':
                self.validationForSubscribe('cure_benefit_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCure先進医療特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureAdvancedMedical
     */
    self.selectedCureAdvancedMedical.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureAdvancedMedical()) {
            case '1':
                self.validationForSubscribe('cure_advanced_medicine_1');
                break;
            case '0':
                self.validationForSubscribe('cure_advanced_medicine_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん診断治療給付金特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOption
     */
    self.selectedCureCancerOption.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOption()) {
            case '1':
                self.validationForSubscribe('cure_cancerpremium_period_1');
                break;
            case '0':
                // 選択されたCureがん通院特約(全商品)がなしの場合、validationをかける
                if (self.selectedCureCancerOutpatient() == '0') {
                    self.validationForSubscribe('cure_cancerpremium_period_2');
                } else {
                    // validationをかけずに、選択されたCureがん通院特約(全商品)をなしに変更
                    self.selectedCureCancerOutpatient('0');
                }
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん通院特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOutpatient
     */
    self.selectedCureCancerOutpatient.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOutpatient()) {
            case '1':
                self.validationForSubscribe('cure_cancer_period_1');
                break;
            case '0':
                self.validationForSubscribe('cure_cancer_period_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCure保険料払込期間(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureInsurancePaymentPeriod
     */
    self.selectedCureInsurancePaymentPeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_period');
    });

    /**
     * 選択されたCureLady入院給付金日額(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyHospitalAmount
     */
    self.selectedCureLadyHospitalAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyHospitalAmount()) {
            case '5000':
                self.validationForSubscribe('cure-l_benefit_1');
                break;
            case '10000':
                self.validationForSubscribe('cure-l_benefit_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLady先進医療特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyAdvancedMedical
     */
    self.selectedCureLadyAdvancedMedical.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyAdvancedMedical()) {
            case '1':
                self.validationForSubscribe('cure-l_advanced_medicine_1');
                break;
            case '0':
                self.validationForSubscribe('cure-l_advanced_medicine_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん診断治療給付金特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOption
     */
    self.selectedCureLadyCancerOption.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOption()) {
            case '1':
                self.validationForSubscribe('cure-l_cancerpremium_period_1');
                break;
            case '0':
                // 選択されたCureLadyがん通院特約（全商品）がなしの場合、validationをかける
                if (self.selectedCureLadyCancerOutpatient() == '0') {
                    self.validationForSubscribe('cure-l_cancerpremium_period_2');
                } else {
                    // validationをかけずに、選択されたCureLadyがん通院特約（全商品）をなしに変更
                    self.selectedCureLadyCancerOutpatient('0');
                }
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん通院特約(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOutpatient
     */
    self.selectedCureLadyCancerOutpatient.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOutpatient()) {
            case '1':
                self.validationForSubscribe('cure-l_cancer_period_1');
                break;
            case '0':
                self.validationForSubscribe('cure-l_cancer_period_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLady保険料払込期間(全商品)を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyInsurancePaymentPeriod
     */
    self.selectedCureLadyInsurancePaymentPeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_period');
    });

    /**
     * 選択されたReliefW入院給付金日額を、subscribeで即時に変更を受け取る
     * @method selectedReliefWHospitalAmount
     */
    self.selectedReliefWHospitalAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedReliefWHospitalAmount()) {
            case '3000':
                self.validationForSubscribe('relief-w_benefit_1');
                break;
            case '5000':
                self.validationForSubscribe('relief-w_benefit_2');
                break;
            case '10000':
                self.validationForSubscribe('relief-w_benefit_3');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたReliefW先進医療特約を、subscribeで即時に変更を受け取る
     * @method selectedReliefWAdvancedMedical
     */
    self.selectedReliefWAdvancedMedical.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedReliefWAdvancedMedical()) {
            case '1':
                self.validationForSubscribe('relief-w_advanced_medicine_1');
                break;
            case '0':
                self.validationForSubscribe('relief-w_advanced_medicine_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたReliefW保険料払込期間を、subscribeで即時に変更を受け取る
     * @method selectedReliefWInsurancePaymentPeriod
     */
    self.selectedReliefWInsurancePaymentPeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('relief-w_period');
    });

    /**
     * 選択されたBelieve基本給付金額（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveAmount
     */
    self.selectedBelieveAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveAmount()) {
            case '5000':
                self.validationForSubscribe('believe_benefit_1');
                break;
            case '10000':
                self.validationForSubscribe('believe_benefit_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieveがん先進医療特約（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerAdvancedMedical
     */
    self.selectedBelieveCancerAdvancedMedical.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerAdvancedMedical()) {
            case '1':
                self.validationForSubscribe('believe_premium_pay_period_1');
                break;
            case '0':
                self.validationForSubscribe('believe_premium_pay_period_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieveがん通院特約（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerOutpatient
     */
    self.selectedBelieveCancerOutpatient.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerOutpatient()) {
            case '1':
                self.validationForSubscribe('believe_cancerhospvisit_period_1');
                break;
            case '0':
                self.validationForSubscribe('believe_cancerhospvisit_period_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieve保険料払込期間（全商品）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveInsurancePaymentPeriod
     */
    self.selectedBelieveInsurancePaymentPeriod.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_period');
    });

    /**
     * 選択されたCureSupport入院給付金日額を、subscribeで即時に変更を受け取る
     * @method selectedCureSupportHospitalAmount
     */
    self.selectedCureSupportHospitalAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureSupportHospitalAmount()) {
            case '3000':
                self.validationForSubscribe('cure-s_benefit_1');
                break;
            case '5000':
                self.validationForSubscribe('cure-s_benefit_2');
                break;
            case '10000':
                self.validationForSubscribe('cure-s_benefit_3');
                break;            default:
                break;
        }
    });

    /**
     * 選択されたCureSupport引受基準緩和型終身保険特約を、subscribeで即時に変更を受け取る
     * @method selectedCureSupportRelaxationLifetimeInsurance
     */
    self.selectedCureSupportRelaxationLifetimeInsurance.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-s_sum_insured');
    });

    /**
     * 選択されたCureSupport引受基準緩和型先進医療特約を、subscribeで即時に変更を受け取る
     * @method selectedCureSupportRelaxationAdvancedMedical
     */
    self.selectedCureSupportRelaxationAdvancedMedical.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureSupportRelaxationAdvancedMedical()) {
            case '1':
                self.validationForSubscribe('cure-s_advanced_medicine_1');
                break;
            case '0':
                self.validationForSubscribe('cure-s_advanced_medicine_2');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたRiseSupport保険金額を、subscribeで即時に変更を受け取る
     * @method selectedRiseSupportInsuranceAmount
     */
    self.selectedRiseSupportInsuranceAmount.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('rise_sum_insured');
    });

    /**
     * 選択されたBridge保険金額(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsuranceAmountBasic
     */
    self.selectedBridgeInsuranceAmountBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_sum_insured_1');
    });

    /**
     * 選択されたBridge保険期間(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsurancePeriodBasic
     */
    self.selectedBridgeInsurancePeriodBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_term_1');
    });

    /**
     * 選択されたCure入院給付金日額(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureHospitalAmountBasic
     */
    self.selectedCureHospitalAmountBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_benefit_1');
    });

    /**
     * 選択されたCure先進医療特約(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureAdvancedMedicalBasic
     */
    self.selectedCureAdvancedMedicalBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureAdvancedMedicalBasic()) {
            case '1':
                // self.advancedMedicine()から呼ばれる場合は、充実プランの変更後にvalidationするためスルー
                if (event.type == 'click' && event.target.id == 'cure_advanced_medicine_11') {
                    self.validationForSubscribe('cure_advanced_medicine_11');
                }
                break;
            case '0':
                self.validationForSubscribe('cure_advanced_medicine_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん診断治療給付金特約(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOptionBasic
     */
    self.selectedCureCancerOptionBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOptionBasic()) {
            case '1':
                self.validationForSubscribe('cure_cancerpremium_period_11');
                break;
            case '0':
                self.validationForSubscribe('cure_cancerpremium_period_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん通院特約(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOutpatientBasic
     */
    self.selectedCureCancerOutpatientBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOutpatientBasic()) {
            case '1':
                self.validationForSubscribe('cure_cancer_period_11');
                break;
            case '0':
                self.validationForSubscribe('cure_cancer_period_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCure保険料払込期間(基本プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureInsurancePaymentPeriodBasic
     */
    self.selectedCureInsurancePaymentPeriodBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_period_1');
    });

    /**
     * 選択されたCureLady入院給付金日額（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyHospitalAmountBasic
     */
    self.selectedCureLadyHospitalAmountBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_benefit_1');
    });

    /**
     * 選択されたCureLady先進医療特約（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyAdvancedMedicalBasic
     */
    self.selectedCureLadyAdvancedMedicalBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyAdvancedMedicalBasic()) {
            case '1':
                // self.advancedMedicine()から呼ばれる場合は、充実プランの変更後にvalidationするためスルー
                if (event.type == 'click' && event.target.id == 'cure-l_advanced_medicine_11') {
                    self.validationForSubscribe('cure-l_advanced_medicine_11');
                }
                break;
            case '0':
                self.validationForSubscribe('cure-l_advanced_medicine_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん診断治療給付金特約（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOptionBasic
     */
    self.selectedCureLadyCancerOptionBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOptionBasic()) {
            case '1':
                self.validationForSubscribe('cure-l_cancerpremium_period_11');
                break;
            case '0':
                // 選択されたCureLadyがん通院特約（基本プラン）がなしの場合、validationをかける
                if (self.selectedCureLadyCancerOutpatientBasic() == '0') {
                    self.validationForSubscribe('cure-l_cancerpremium_period_12');
                } else {
                    // validationをかけずに、選択されたCureLadyがん通院特約（基本プラン）をなしに変更
                    self.selectedCureLadyCancerOutpatientBasic('0');
                }
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん通院特約（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOutpatientBasic
     */
    self.selectedCureLadyCancerOutpatientBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOutpatientBasic()) {
            case '1':
                self.validationForSubscribe('cure-l_cancer_period_11');
                break;
            case '0':
                self.validationForSubscribe('cure-l_cancer_period_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLady保険料払込期間（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyInsurancePaymentPeriodBasic
     */
    self.selectedCureLadyInsurancePaymentPeriodBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_period_1');
    });

    /**
     * 選択されたBelieve基本給付金額（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveAmountBasic
     */
    self.selectedBelieveAmountBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_benefit_1');
    });

    /**
     * 選択されたBelieveがん先進医療特約（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerAdvancedMedicalBasic
     */
    self.selectedBelieveCancerAdvancedMedicalBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerAdvancedMedicalBasic()) {
            case '1':
                // self.advancedMedicine()から呼ばれる場合は、充実プランの変更後にvalidationするためスルー
                if (event.type == 'click' && event.target.id == 'believe_premium_pay_period_11') {
                    self.validationForSubscribe('believe_premium_pay_period_11');
                }
                break;
            case '0':
                self.validationForSubscribe('believe_premium_pay_period_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieveがん通院特約（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerOutpatientBasic
     */
    self.selectedBelieveCancerOutpatientBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerOutpatientBasic()) {
            case '1':
                self.validationForSubscribe('believe_cancerhospvisit_period_11');
                break;
            case '0':
                self.validationForSubscribe('believe_cancerhospvisit_period_12');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieve保険料払込期間（基本プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveInsurancePaymentPeriodBasic
     */
    self.selectedBelieveInsurancePaymentPeriodBasic.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_period_1');
    });

    /**
     * 選択されたBridge保険金額（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsuranceAmountRich
     */
    self.selectedBridgeInsuranceAmountRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_sum_insured_2');
    });

    /**
     * 選択されたBridge保険期間（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBridgeInsurancePeriodRich
     */
    self.selectedBridgeInsurancePeriodRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('bridge_term_2');
    });

    /**
     * 選択されたCure入院給付金日額（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureHospitalAmountRich
     */
    self.selectedCureHospitalAmountRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_benefit_2');
    });

    /**
     * 選択されたCure先進医療特約(充実プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureAdvancedMedicalRich
     */
    self.selectedCureAdvancedMedicalRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureAdvancedMedicalRich()) {
            case '1':
                self.validationForSubscribe('cure_advanced_medicine_21');
                break;
            case '0':
                self.validationForSubscribe('cure_advanced_medicine_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん診断治療給付金特約(充実プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOptionRich
     */
    self.selectedCureCancerOptionRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOptionRich()) {
            case '1':
                self.validationForSubscribe('cure_cancerpremium_period_21');
                break;
            case '0':
                self.validationForSubscribe('cure_cancerpremium_period_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureがん通院特約(充実プラン)を、subscribeで即時に変更を受け取る
     * @method selectedCureCancerOutpatientRich
     */
    self.selectedCureCancerOutpatientRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureCancerOutpatientRich()) {
            case '1':
                self.validationForSubscribe('cure_cancer_period_21');
                break;
            case '0':
                self.validationForSubscribe('cure_cancer_period_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCure保険料払込期間（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureInsurancePaymentPeriodRich
     */
    self.selectedCureInsurancePaymentPeriodRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure_period_2');
    });

    /**
     * 選択されたCureLady入院給付金日額（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyHospitalAmountRich
     */
    self.selectedCureLadyHospitalAmountRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_benefit_2');
    });

    /**
     * 選択されたCureLady先進医療特約（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyAdvancedMedicalRich
     */
    self.selectedCureLadyAdvancedMedicalRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyAdvancedMedicalRich()) {
            case '1':
                self.validationForSubscribe('cure-l_advanced_medicine_21');
                break;
            case '0':
                self.validationForSubscribe('cure-l_advanced_medicine_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん診断治療給付金特約（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOptionRich
     */
    self.selectedCureLadyCancerOptionRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOptionRich()) {
            case '1':
                self.validationForSubscribe('cure-l_cancerpremium_period_21');
                break;
            case '0':
                // 選択されたCureLadyがん通院特約（充実プラン）がなしの場合、validationをかける
                if (self.selectedCureLadyCancerOutpatientRich() == '0') {
                    self.validationForSubscribe('cure-l_cancerpremium_period_22');
                } else {
                    // validationをかけずに、選択されたCureLadyがん通院特約（充実プラン）をなしに変更
                    self.selectedCureLadyCancerOutpatientRich('0');
                }
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLadyがん通院特約（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyCancerOutpatientRich
     */
    self.selectedCureLadyCancerOutpatientRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedCureLadyCancerOutpatientRich()) {
            case '1':
                self.validationForSubscribe('cure-l_cancer_period_21');
                break;
            case '0':
                self.validationForSubscribe('cure-l_cancer_period_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたCureLady保険料払込期間（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedCureLadyInsurancePaymentPeriodRich
     */
    self.selectedCureLadyInsurancePaymentPeriodRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('cure-l_period_2');
    });

    /**
     * 選択されたBelieve基本給付金額（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveAmountRich
     */
    self.selectedBelieveAmountRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_benefit_2');
    });

    /**
     * 選択されたBelieveがん先進医療特約（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerAdvancedMedicalRich
     */
    self.selectedBelieveCancerAdvancedMedicalRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerAdvancedMedicalRich()) {
            case '1':
                self.validationForSubscribe('believe_premium_pay_period_21');
                break;
            case '0':
                self.validationForSubscribe('believe_premium_pay_period_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieveがん通院特約（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveCancerOutpatientRich
     */
    self.selectedBelieveCancerOutpatientRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        switch (self.selectedBelieveCancerOutpatientRich()) {
            case '1':
                self.validationForSubscribe('believe_cancerhospvisit_period_21');
                break;
            case '0':
                self.validationForSubscribe('believe_cancerhospvisit_period_22');
                break;
            default:
                break;
        }
    });

    /**
     * 選択されたBelieve保険料払込期間（充実プラン）を、subscribeで即時に変更を受け取る
     * @method selectedBelieveInsurancePaymentPeriodRich
     */
    self.selectedBelieveInsurancePaymentPeriodRich.subscribe(function() {
        // validation無効フラグがtrueなら処理終了
        if (disableValidation) return;
        self.validationForSubscribe('believe_period_2');
    });

    /**
     * 入院給付金日額合計が1万円を超えているかどうか
     * @method isOverHospitalAmount
     * @return {bool} true: 1万円を超えている, false: 1万円以内である
     */
    self.isOverHospitalAmount = ko.computed(function() {
        // 全商品の場合
        if (self.isFreePlan()) {
            var sumHospitalAmount =
                (self.isSelectedCure() ? parseInt(self.selectedCureHospitalAmount(), 10) : 0) +
                (self.isSelectedCureLady() ? parseInt(self.selectedCureLadyHospitalAmount(), 10) : 0) +
                (self.isSelectedReliefW() ? parseInt(self.selectedReliefWHospitalAmount(), 10) : 0);
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 基本プランの場合
            if (self.isSelectPlanBasic()) {
                var sumHospitalAmount =
                    (self.isSelectedCure() ? parseInt(self.selectedCureHospitalAmountBasic(), 10) : 0) +
                    (self.isSelectedCureLady() ? parseInt(self.selectedCureLadyHospitalAmountBasic(), 10) : 0);
            // 充実プランの場合
            } else if (self.isSelectPlanRich()) {
                var sumHospitalAmount =
                    (self.isSelectedCure() ? parseInt(self.selectedCureHospitalAmountRich(), 10) : 0) +
                    (self.isSelectedCureLady() ? parseInt(self.selectedCureLadyHospitalAmountRich(), 10) : 0);
            }
        }
        return sumHospitalAmount > 10000;
    }, self);

    // 保険料合計（全商品）
    self.sumInsurance = {
        p1: ko.observable('0'),
        p6: ko.observable('0'),
        p12: ko.observable('0')
    }

    // 保険料合計（基本プラン）
    self.sumInsuranceBasic = {
        p1: ko.observable('0'),
        p6: ko.observable('0'),
        p12: ko.observable('0')
    }

    // 保険料合計（充実プラン）
    self.sumInsuranceRich = {
        p1: ko.observable('0'),
        p6: ko.observable('0'),
        p12: ko.observable('0')
    }

    // View State
    self.showModal = ko.observable(false);  // モーダル表示フラグ
    self.modalErrorMsg = ko.observable(); // モーダル用メッセージテキスト
    self.simulationView = ko.observable();

    /**
     * 全商品とおすすめ商品の切り替えボタン押下時の処理
     * @method clickChangePlan
     * @param changeIndex {string} 遷移先のindex
     */
    self.clickChangePlan = function(changeIndex) {
        // 資料請求用キーライン
        var okl = '';
        if (self.okl()) okl = 'oKL=' + self.okl() + '&';
        // 性別
        var strSex = 'strsex=' + self.selectedGender();
        // 誕生日
        var birthday = '&birthday=' + self.selectedBirthday();
        // 代理店コード
        var ag = '';
        if (self.ag()) ag = '&' + 'ag=' + self.ag();
        // 募集人コード        
        var sl = '';
        if (self.sl()) sl = '&' + 'sl=' + self.sl();
        // 性別制御
        var genderCtl = '';
        if (self.genderCtl()) genderCtl = '&' + 'genderctl=' + self.genderCtl();
        // パラメータ結合
        var params = okl + strSex + birthday + ag + sl + genderCtl;

        // 自画面のindexによって、遷移先を変更
        // index1→index5, index4→index3, index5→index1
        switch (changeIndex) {
            case "3":
            case "5":
                window.location = '/estimate/index' + changeIndex + '.htm?' + params;
                break;
            case "1":
                window.location = '/estimate/index.htm?' + params;
                break;
            default:
                break;
        }
    }

    /**
     * ボタンの押下時の処理
     * @method clickGoToButton
     * @param button {string} ボタンの種類
     * @returns {Boolean}
     */
    self.clickGoToButton = function(buttonKind) {
        var result = true;
        var errMsg ='';

        // シミュレーション実行中はクリックキャンセル
        if (self.isExecuteSimulating()){
            return false;
        }

        // 20未満の場合はクリックをキャンセルかつメッセージ表示
        if (self.contractAge() < 20) {
            // $(".pop-box000-birth").css("display", "block");
            errMsg = 'インターネットからのお申込みの場合は、契約年齢20歳以上とさせていただきます。';
            result = false;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            //FineSaveまたはRiseSupportが選択されている場合は、クリックをキャンセルかつメッセージ表示
            if (self.isSelectedFineSave() || self.isSelectedRiseSupport()) {
                // $(".pop-box000-product").css("display", "block");
            	if (errMsg != '') {
                    errMsg += '<br><br>';
                }
                // 「お申込み手続き」と「シミュレーション結果を保存する」で文言を出しわけ
                if (buttonKind == 'apply') {
                    errMsg += '「ファインセーブ」と「ライズ・サポート」については、インターネットからのお申込みはできません。お申込みは郵送のみとなります。';
                } else if (buttonKind == 'save') {
                    errMsg += '「ファインセーブ」と「ライズ・サポート」については、郵送のみのお申込みのためシミュレーション結果の保存はできません。';
                }

                result = false;
            }
            //商品が何も選択されていない場合クリックをキャンセル
            if (!self.isSelectedBridge() && !self.isSelectedFineSave() && !self.isSelectedKeep() && !self.isSelectedCure() && !self.isSelectedCureLady() && !self.isSelectedReliefW() && !self.isSelectedBelieve() && !self.isSelectedCureSupport() &&!self.isSelectedRiseSupport()) {
                return true;
            }
            //おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            //商品が何も選択させていない場合クリックをキャンセル
            if (!self.isSelectedBridge() && !self.isSelectedCure() && !self.isSelectedCureLady() && !self.isSelectedBelieve()){
                return true;
            }
        }

        // クライアントチェックNGの場合、サーバーチェック前にエラーダイアログを表示する
        if (result === false) {
            //メッセージを表示
            self.showErrorModal(errMsg);
            return true;
        }

        // サーバーバリデーション実行前、initializePropertyに値をセット
        self.setInitializeProperty();

        // 保険の選択状態をself.plan()に反映
        self.setPlanData();

        // どのプランを選択しているかをセット
        self.plan().selectedPlan = self.selectedPlan();

        // サーバーバリデーションを実行する
        var apiUrl = '/mypage/api/simulation-result';
        // ポストデータ作成
        var postData = {
            'status': 'OK',
            '_token': 'testToken',
            'position': 'simulation',
            'content': self.plan()
        }

        console.log('ServerValidationへのpostData↓');
        console.log(postData);

        // サーバーバリデーションAPI呼び出し
        app.ajax(apiUrl, postData, true)
        .done(function(result, textStatus, jqXHR) {
            console.log('ServerValidation結果↓');
            console.log(result);

            // サーバーバリデーションエラーが発生した場合
            if (result.content.hasValidationErrors) {
                var validationErrors = '';
                for (var i=0; i<result.content.validationErrors.length; i++) {
                    // 最初以外は改行
                    if (i != 0) {
                        validationErrors += '<br>';
                    }
                    // メッセージを詰める
                    validationErrors += result.content.validationErrors[i].message;
                }
                // モーダルメッセージを表示
                self.showErrorModal(validationErrors);
                return true;
            } else {
                // バリデーションチェックOK
                if (buttonKind == 'apply') {
                    // お申込手続きへボタン
                    location.href = 'sim/result';
                } else if (buttonKind == 'save') {
                    // シミュレーション結果を保存するボタン
                }
            }
        })
    };

    /**
     * シミュレーション実行
     * @method executeSimulation
     * @param target {string} 保険料計算対象
     * @param force {boolean} 強制的に保険料計算対象フラグをたてる
     */
    self.executeSimulation = function(target, force){
        // 保険料計算対象を設定
        ko.utils.arrayForEach(self.plan().products, function(product){
            switch (product.productCd) {
                case "3G":
                    // Bridgeの保険料計算対象フラグをたてる
                    if (target == "3G" || force) {
                        product.isCalcTarget = true;
                        // プランごとに計算対象フラグをたてる
                        if (self.isFreePlan()) {
                            self.isCalcTargetBridge(true);
                        } else if (force && self.isSelectPlan()) {
                            // スタートボタン押下時、かつ、おすすめ商品の場合は基本・充実プラン両方に計算対象フラグをたてる
                            self.isCalcTargetBridgeBasic(true);
                            self.isCalcTargetBridgeRich(true);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetBridgeBasic(true);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetBridgeRich(true);
                        }                        
                    }
                    break;
                case "37":
                    // FineSaveの保険料計算対象フラグをたてる
                    if ( (target == "37" || force) && self.isFreePlan()) {
                        product.isCalcTarget = true;
                        self.isCalcTargetFineSave(true);
                    }
                    break;
                case "3F":
                    // Keepの保険料計算対象フラグをたてる
                    if ( (target == "3F" || force) && self.isFreePlan()) {
                        product.isCalcTarget = true;
                        self.isCalcTargetKeep(true);
                    }
                    break;
                case "4C":
                    // Cureの保険料計算対象フラグをたてる
                    if (target == "4C" || force) {
                        product.isCalcTarget = true;
                        // プランごとに計算対象フラグをたてる
                        if (self.isFreePlan()) {
                            self.isCalcTargetCure(true);
                        } else if (force && self.isSelectPlan()) {
                            // スタートボタン押下時、かつ、おすすめ商品の場合は基本・充実プラン両方に計算対象フラグをたてる
                            self.isCalcTargetCureBasic(true);
                            self.isCalcTargetCureRich(true);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetCureBasic(true);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetCureRich(true);
                        }
                    }
                    break;
                case "4A":
                    // CureLadyの保険料計算対象フラグをたてる
                    if (target == "4A" || force) {
                        product.isCalcTarget = true;
                        // プランごとに計算対象フラグをたてる
                        if (self.isFreePlan()) {
                            self.isCalcTargetCureLady(true);
                        } else if (force && self.isSelectPlan()) {
                            // スタートボタン押下時、かつ、おすすめ商品の場合は基本・充実プラン両方に計算対象フラグをたてる
                            self.isCalcTargetCureLadyBasic(true);
                            self.isCalcTargetCureLadyRich(true);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetCureLadyBasic(true);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetCureLadyRich(true);
                        }
                    }
                    break;
                case "1P":
                    // ReliefWの保険料計算対象フラグをたてる
                    if ( (target == "1P" || force) && self.isFreePlan()) {
                        product.isCalcTarget = true;
                        self.isCalcTargetReliefW(true);
                    }
                    break;
                case "1V":
                    // Believeの保険料計算対象フラグをたてる
                    if (target == "1V" || force) {
                        product.isCalcTarget = true;
                        // プランごとに計算対象フラグをたてる
                        if (self.isFreePlan()) {
                            self.isCalcTargetBelieve(true);
                        } else if (force && self.isSelectPlan()) {
                            // スタートボタン押下時、かつ、おすすめ商品の場合は基本・充実プラン両方に計算対象フラグをたてる
                            self.isCalcTargetBelieveBasic(true);
                            self.isCalcTargetBelieveRich(true);                            
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetBelieveBasic(true);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetBelieveRich(true);
                        }
                    }
                    break;
                case "1W":
                    // CureSupportの保険料計算対象フラグをたてる
                    if ( (target == "1W" || force) && self.isFreePlan()) {
                        product.isCalcTarget = true;
                        self.isCalcTargetCureSupport(true);
                    }
                    break;
                case "1Y":
                    // RiseSupportの保険料計算対象フラグをたてる
                    if ( (target == "1Y" || force) && self.isFreePlan()) {
                        product.isCalcTarget = true;
                        self.isCalcTargetRiseSupport(true);
                    }
                    break;
                default:
                    break;
            }
        });

        // どのプランを選択しているかをセット
        self.plan().selectedPlan = self.selectedPlan();

        // 強制的に保険料計算対象フラグをたてる場合、
        // 全商品（9商品）・おすすめ商品（4商品）すべてのフラグをたてるまではreturn
        if (force) {
            // 保険料計算対象フラグのカウントを増やす
            isCalcTargetCount += 1;

            // 全商品で保険料計算対象フラグのカウントが9未満の場合はAPI実行しない
            if (self.isFreePlan() && isCalcTargetCount < 9) {
                return;
            // おすすめ商品で保険料計算対象フラグのカウントが4未満の場合はAPI実行しない
            } else if (self.isSelectPlan() && isCalcTargetCount < 4) {
                return;
            }

            // おすすめ商品の場合、全プラン再計算を行う
            if (self.isSelectPlan()) {
                self.plan().selectedPlan = 'all';
            }

            // 保険料計算対象フラグのカウントを初期化
            isCalcTargetCount = 0;
            // validation無効フラグをtrueにする
            disableValidation = true;

        }
        // 全プラン再計算フラグがtrueの場合、全プラン再計算を行う
        if (isSelectPlanAll) {
            self.plan().selectedPlan = 'all';
            isSelectPlanAll = false;
        }

        // 保険の選択状態をself.plan()に反映
        self.setPlanData();

        // 強制的に保険料計算対象フラグをたてる場合
        if (force && Object.keys(tempProducts).length > 0) {
            // 保険プランのご確認画面から戻ってくる場合があるため、一時保存していた商品情報を反映
            self.plan().products = tempProducts.products;
            // すべての計算対象フラグをtrue
            ko.utils.arrayForEach(self.plan().products, function(product){
               product.isCalcTarget = true;
            });
        }
        
        // APIURL
        var apiUrl = "/mypage/api/simulation";

        // ポストデータ作成
        var postData = {
            'status': 'OK',
            '_token': 'testToken',
            'position': 'simulation',
            'content': self.plan()
        };

        console.log('%cexecuteSimulationへのpostData:', app.apiRequeStyleStyle, postData);

        // シミュレーション中フラグ設定
        self.isExecuteSimulating(true);
        // シミュレーションAPI呼び出し
        app.ajax(apiUrl, postData, false)
        .done(function(result, textStatus, jqXHR) {
            // for debug
            console.log('%cexecuteSimulationの結果:', app.apiResponseStyle, result);

            // シミュレーション結果を各変数に適用
            self.plan(result.content);
            self.products(result.content.products);

            // 保険の選択状態を設定
            ko.utils.arrayForEach(self.products(), function(product){
                self.setSelectState(product);
                self.createProductInfo(product);
            });

            // 保険料合計を計算
            self.sum();
        })
        .always(function(){
            // validation無効フラグをfalseにする
            disableValidation = false;

            // 各商品の保険料計算対象フラグを初期化
            self.initIsCalcTarget(force);

            // 初回シミュレーション実行の場合
            if (self.firstSimulation()) {
                // 一時保存したisSelectedを復元する
                ko.utils.arrayForEach(self.products(), function(product){
                    self.restoreSelectState(product);
                });
                // 初回シミュレーションフラグをfalse
                self.firstSimulation(false);
            }
            // スタートボタン押下時のすべての商品の保険料計算の場合
            if (force) {
                $('#user-status').unblock();
                $('#products-wrapper').unblock();
                // 選択商品の最上部にスクロール
                self.scrollToActiveProduct();
            }
            // シミュレーション中判定フラグをfalseに変更
            self.isExecuteSimulating(false);

            // 選択商品の組み合わせで商品を活性化・非活性化
            self.selectItem();

            // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
            self.setCureSupportRelaxationLifetimeInsurance();

            // スタートボタン押下時のすべての商品の保険料計算の場合
            if (force) {
                // 先進医療特約設定
                self.advancedMedicine();
                // おすすめ商品のCureLady入院給付金日額（充実プラン）の値を設定
                self.setCureLadyHospitalAmounRich();

                // 給付金額のdisable制御をかける
                self.controlAmount();
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // alert('AJAXエラー発生');
            console.log('AJax Status: ' + jqXHR.status + ", " + textStatus + ", errorThrown:" + errorThrown);

            // TODO: シミュレーション失敗時の処理を記述する
        });
    }

    /**
     * 選択されている商品の保険料を合計します
     * @method sum
     */
    self.sum = function(){
        var sumP1 = 0;
        var sumP6 = 0;
        var sumP12 = 0;
        var basicSumP1 = 0;
        var basicSumP6 = 0;
        var basicSumP12 = 0;
        var richSumP1 = 0;
        var richSumP6 = 0;
        var richSumP12 = 0;

        ko.utils.arrayForEach(self.plan().products, function(product){
            // 選択されている商品のみ合計する
            if( (product.productCd == '3G' && self.isSelectedBridge()) || 
                (product.productCd == '37' && self.isSelectedFineSave()) || 
                (product.productCd == '3F' && self.isSelectedKeep()) || 
                (product.productCd == '4C' && self.isSelectedCure()) || 
                (product.productCd == '4A' && self.isSelectedCureLady()) || 
                (product.productCd == '1P' && self.isSelectedReliefW()) || 
                (product.productCd == '1V' && self.isSelectedBelieve()) || 
                (product.productCd == '1W' && self.isSelectedCureSupport()) || 
                (product.productCd == '1Y' && self.isSelectedRiseSupport()) 
                ) {
                // 全商品の場合
                if (self.isFreePlan()) {
                    sumP1 += Number(product.plans.standard.premiums.p1);
                    sumP6 += Number(product.plans.standard.premiums.p6);
                    sumP12 += Number(product.plans.standard.premiums.p12);
                // おすすめ商品の場合
                } else if (self.isSelectPlan) {
                    basicSumP1 += Number(product.plans.basic.premiums.p1);
                    basicSumP6 += Number(product.plans.basic.premiums.p6);
                    basicSumP12 += Number(product.plans.basic.premiums.p12);
                    richSumP1 += Number(product.plans.rich.premiums.p1);
                    richSumP6 += Number(product.plans.rich.premiums.p6);
                    richSumP12 += Number(product.plans.rich.premiums.p12);
                }
            }
        });

        // 全商品の場合
        if (self.isFreePlan()) {
            self.sumInsurance.p1(addComma(sumP1));
            self.sumInsurance.p6(addComma(sumP6));
            self.sumInsurance.p12(addComma(sumP12));
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            self.sumInsuranceBasic.p1(addComma(basicSumP1));
            self.sumInsuranceBasic.p6(addComma(basicSumP6));
            self.sumInsuranceBasic.p12(addComma(basicSumP12));
            self.sumInsuranceRich.p1(addComma(richSumP1));
            self.sumInsuranceRich.p6(addComma(richSumP6));
            self.sumInsuranceRich.p12(addComma(richSumP12));
        }
    }

    /**** イベント ****/
    /**
     * 初期化処理
     * @method init
     * @param  {Object} content [description]
     */
    self.init = function(content){

        // 生年月日ダイアログ作成、selectedBirthdayXXXの設定
        self.loadBirthdaySettings(content);
        // 性別が指定されている場合、変数に設定する
        if (content.applyInfo.gender) {
            self.selectedGender(content.applyInfo.gender);
        }

        if (self.IS_LOGIN) {
            // ログインされている場合、ここで生年月日、性別を設定する
            self.selectedBirthdayYear('1990');
            self.selectedBirthdayMonth('4');
            self.selectedBirthdayDay('2');
            self.selectedGender('2');

            self.calcAge(); // 契約年齢計算(検証用)
        } else if (self.selectedBirthdayYear()
                  && self.selectedBirthdayMonth()
                  && self.selectedBirthdayDay()
                  && self.selectedGender()) {
            // クエリパラメータで生年月日と性別が渡された場合
            // ダイアログは表示せず、シミュレーションを実行する。

        } else {
            // ログインされていない場合
            if (!self.selectedGender()) {
                // 性別が設定されていなかったら男性に設定する
                self.selectedGender('1');
            }
            self.showSettingProfileDialog();
        }

        // Todo: 支払回数を設定(暫定的にinitメソッドで実行、後で削除する)
        self.paymentCount(content.applyInfo.paymentCount);

        // 性別と生年月日が入力されている場合、選択商品の最上部にスクロール
        if (content.applyInfo.birthdayYear && content.applyInfo.birthdayMonth && content.applyInfo.birthdayDay && content.applyInfo.gender) {
            self.clickStartButton();
        }
    };

    /**
     * 支払回数が変更されたときに呼び出されるメソッド
     * @method clickPaymentCount
     * @param paymentCount {string} 支払回数
     */
    self.clickPaymentCount = function(paymentCount) {

        self.paymentCount(paymentCount);

        //選択した払込方法（回数）をself.plan()に反映させる
        self.plan().applyInfo.paymentCount = paymentCount;

        // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
        self.setCureSupportRelaxationLifetimeInsurance();
        
        // 選択商品の組み合わせで商品を活性化・非活性化
        self.selectItem();

        // 先進医療特約設定
        self.advancedMedicine();

        // 契約年齢計算
        self.calcAge();

        // デフォルトのクリックの挙動を許可する
        return true;
    }

    /**
     * 生年月日選択ダイアログ作成
     * @method loadBirthdaySettings
     */
    self.loadBirthdaySettings =  function(content){

        // プルダウン作成
    	self.setYear(content.applyInfo.birthdayYear,
                     content.applyInfo.birthdayMonth,
                     content.applyInfo.birthdayDay);
    }

    /**
     * 各保険の商品固有情報を設定
     * @method createProductInfo
     * @param product {Object} 商品データ構造
     */
    self.createProductInfo = function(product) {
        // 保険料計算対象フラグがtrueの場合、設定する
        switch (product.productCd) {
            case "3G":
                if (product.isCalcTarget) {
                    self.createBridgeProductInfo(product.plans);
                }                
                break;
            case "37":
                if (product.isCalcTarget) {
                    self.createFineSaveProductInfo(product.plans);
                }
                break;
            case "3F":
                if (product.isCalcTarget) {
                    self.createKeepProductInfo(product.plans);
                }
                break;
            case "4C":
                if (product.isCalcTarget) {
                    self.createCureProductInfo(product.plans);
                }
                break;
            case "4A":
                if (product.isCalcTarget) {
                    self.createCureLadyProductInfo(product.plans);
                }
                break;
            case "1P":
                if (product.isCalcTarget) {
                    self.createReliefWProductInfo(product.plans);
                }
                break;
            case "1V":
                if (product.isCalcTarget) {
                    self.createBelieveProductInfo(product.plans);
                }
                break;
            case "1W":
                if (product.isCalcTarget) {
                    self.createCureSupportProductInfo(product.plans);
                }
                break;
            case "1Y":
                if (product.isCalcTarget) {
                    self.createRiseSupportProductInfo(product.plans);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Cure、CureLady、ReliefWの複数同時申込時に文言表示
     * @method threeItem
     */
    self.threeItem = function() {
        var count = 0;
        if (self.isSelectedCure()) count++;
        if (self.isSelectedCureLady()) count++;
        if (self.isSelectedReliefW()) count++;

        // Cure、CureLady、ReliefWのいずれかの商品のチェックボックスが選択されている場合
        if (count > 1) {
            self.displayGurdFooter02(true);
        } else {
            self.displayGurdFooter02(false);
        }

        if (self.isSelectedBelieve()) count++;

        // Cure、CureLady、ReliefW、Believeのいずれかの商品のチェックボックスが選択されている場合
        if (count > 1) {
            self.displayGurdFooter03(true);

        } else {
            self.displayGurdFooter03(false);
        }

        // 商品数カウント表示
        if (self.isSelectPlan()) {
            if (self.isSelectedBridge()) count++;
            self.selectedProductCount(count);
        }
    }

    /**
     * 給付金額のdisable制御
     * @method controlAmount
     */
    self.controlAmount = function() {
        // おすすめ商品の場合は、return
        if (self.isSelectPlan()) {
            return;
        }

        // CureLady選択、かつ、61歳～75歳の場合
        if (self.isSelectedCureLady() && 61 <= self.contractAge() && self.contractAge() <= 75) {
            // CureLady入院給付金日額の10000円をdisableにして、5000円を選択
            self.selectedCureLadyHospitalAmountDisable(true);
            self.selectedCureLadyHospitalAmount("5000");
        } else {
            // CureLady入院給付金日額の10000円のdisableを解除
            self.selectedCureLadyHospitalAmountDisable(false);
            // Cure入院給付金日額の10000円のdisableを解除
            self.selectedCureHospitalAmountDisable(false);
            // ReliefW入院給付金日額のdisableを解除
            self.selectedReliefWHospitalAmountDisable(false);
        }

        // Believe選択、かつ、50歳~75歳の場合
        if (self.isSelectedBelieve() && 50 <= self.contractAge() && self.contractAge() <= 75) {
            // Believe基本給付金額の5000円のdisableを解除
            self.selectedBelieveAmountDisable(false);
        } else {
            // Believe基本給付金額の5000円をdisableにして10000円を選択
            self.selectedBelieveAmountDisable(true);
            self.selectedBelieveAmount("10000");
        }

        // CureSuppoｒｔを選択、かつ、20歳～59歳の場合
        if (self.isSelectedCureSupport() && 20 <= self.contractAge() && self.contractAge() <= 59) {
            // CureSupport入院給付金日額の3000円をdisableにする
            self.selectedCureSupportHospitalAmountDisable(true);

            //  CureSupport入院給付金日額が3000円を選択している場合
            if (self.selectedCureSupportHospitalAmount() == '3000') {
                // CureSupport入院給付金日額の5000円を選択
                self.selectedCureSupportHospitalAmount("5000");
            }
        } else {
            // CureSupport入院給付金日額の3000円のdisableを解除
            self.selectedCureSupportHospitalAmountDisable(false);            
        }
    }

    /**
     * 先進医療特約変更
     * @method controlAdvancedMedicine
     * @param data {Object}
     */
    self.controlAdvancedMedicine = function(data) {
        // シミュレーション種別が2の場合は、return
        if (self.index() == '2') {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // Cureの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            if (data.target.id == 'cure_advanced_medicine_1') {
                self.selectedCureLadyAdvancedMedical('0');
                self.selectedReliefWAdvancedMedical('0');
                self.selectedBelieveCancerAdvancedMedical('0');
            // CureLadyの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'cure-l_advanced_medicine_1') {
                self.selectedCureAdvancedMedical('0');
                self.selectedReliefWAdvancedMedical('0');
                self.selectedBelieveCancerAdvancedMedical('0');
            // Believeのがん先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'believe_premium_pay_period_1') {
                self.selectedCureAdvancedMedical('0');
                self.selectedCureLadyAdvancedMedical('0');
                self.selectedReliefWAdvancedMedical('0');
            // ReliefWの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'relief-w_advanced_medicine_1') {
                self.selectedCureAdvancedMedical('0');
                self.selectedCureLadyAdvancedMedical('0');
                self.selectedBelieveCancerAdvancedMedical('0');
            }

            // Cureが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Cure以外の先進医療特約「付加しない」を押下した場合、Cureの先進医療特約「付加する」
            if (self.isSelectedCure() && self.selectedCureLadyAdvancedMedical() == '0' && self.selectedReliefWAdvancedMedical() == '0' && self.selectedBelieveCancerAdvancedMedical() == '0' && (data.target.id == 'cure-l_advanced_medicine_2' || data.target.id == 'relief-w_advanced_medicine_2' || data.target.id == 'believe_premium_pay_period_2')) {
                self.selectedCureAdvancedMedical('1');
            // CureLadyが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、CureLady以外の先進医療特約「付加しない」を押下した場合、CureLadyの先進医療特約「付加する」
            } else if (self.isSelectedCureLady() && self.selectedCureAdvancedMedical() == '0' && self.selectedReliefWAdvancedMedical() == '0' && self.selectedBelieveCancerAdvancedMedical() == '0' && (data.target.id == 'cure_advanced_medicine_2' || data.target.id == 'relief-w_advanced_medicine_2' || data.target.id == 'believe_premium_pay_period_2')) {
                self.selectedCureLadyAdvancedMedical('1');
            // Believeが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Believe以外の先進医療特約「付加しない」を押下した場合、Believeのがん先進医療特約「付加する」
            } else if (self.isSelectedBelieve() && self.selectedCureAdvancedMedical() == '0' && self.selectedCureAdvancedMedical() == '0' && self.selectedReliefWAdvancedMedical() == '0' && self.selectedReliefWAdvancedMedical() == '0' && (data.target.id == 'cure_advanced_medicine_2' || data.target.id == 'cure-l_advanced_medicine_2' || data.target.id == 'relief-w_advanced_medicine_2')) {
                self.selectedBelieveCancerAdvancedMedical('1');
            // ReliefWが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、ReliefW以外の先進医療特約「付加しない」を押下した場合、ReliefWの先進医療特約「付加する」
            } else if (self.isSelectedReliefW() && self.selectedCureAdvancedMedical() == '0' && self.selectedCureAdvancedMedical() == '0' && self.selectedBelieveCancerAdvancedMedical() == '0' && (data.target.id == 'cure_advanced_medicine_2' || data.target.id == 'cure-l_advanced_medicine_2' || data.target.id == 'believe_premium_pay_period_2')) {
                self.selectedReliefWAdvancedMedical('1');
            }

            // Believeのがん先進医療特約「付加する」にチェックがついている場合
            // CureSupportの引受基準緩和型先進医療特約「付加する」要素を隠して、「付加しない」
            if (self.selectedBelieveCancerAdvancedMedical() == '1') {
                self.hideCureSupportRelaxationAdvancedMedical("1");
                self.selectedCureSupportRelaxationAdvancedMedical('0');
            // CureSupportの引受基準緩和型先進医療特約「付加しない」要素を隠して、「付加する」
            } else {
                self.hideCureSupportRelaxationAdvancedMedical("0");
                self.selectedCureSupportRelaxationAdvancedMedical('1');
            }
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // Cureの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            if (data.target.id == 'cure_advanced_medicine_11') {
                self.selectedCureLadyAdvancedMedicalBasic('0');
                self.selectedBelieveCancerAdvancedMedicalBasic('0');
            // CureLadyの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'cure-l_advanced_medicine_11') {
                self.selectedCureAdvancedMedicalBasic('0');
                self.selectedBelieveCancerAdvancedMedicalBasic('0');
            // Believeのがん先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'believe_premium_pay_period_11') {
                self.selectedCureAdvancedMedicalBasic('0');
                self.selectedCureLadyAdvancedMedicalBasic('0');
            }
            // Cureが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Cure以外の先進医療特約「付加しない」を押下した場合、Cureの先進医療特約「付加する」
            if (self.isSelectedCure() && self.selectedCureLadyAdvancedMedicalBasic() == '0' && self.selectedBelieveCancerAdvancedMedicalBasic() == '0' && (data.target.id == 'cure-l_advanced_medicine_12' || data.target.id == 'believe_premium_pay_period_12')) {
                self.selectedCureAdvancedMedicalBasic('1');
            // CureLadyが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、CureLady以外の先進医療特約「付加しない」を押下した場合、CureLadyの先進医療特約「付加する」
            } else if (self.isSelectedCureLady() && self.selectedCureAdvancedMedicalBasic() == '0' && self.selectedBelieveCancerAdvancedMedicalBasic() == '0' && (data.target.id == 'cure_advanced_medicine_12' || data.target.id == 'believe_premium_pay_period_12')) {
                self.selectedCureLadyAdvancedMedicalBasic('1');
            // Believeが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Believe以外の先進医療特約「付加しない」を押下した場合、Believeのがん先進医療特約「付加する」
            } else if (self.isSelectedBelieve() && self.selectedCureAdvancedMedicalBasic() == '0' && self.selectedCureLadyAdvancedMedicalBasic() == '0' && (data.target.id == 'cure_advanced_medicine_12' || data.target.id == 'cure-l_advanced_medicine_12')) {
                self.selectedBelieveCancerAdvancedMedicalBasic('1');
            }

            // Cureの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            if (data.target.id == 'cure_advanced_medicine_21') {
                self.selectedCureLadyAdvancedMedicalRich('0');
                self.selectedBelieveCancerAdvancedMedicalRich('0');
            // CureLadyの先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'cure-l_advanced_medicine_21') {
                self.selectedCureAdvancedMedicalRich('0');
                self.selectedBelieveCancerAdvancedMedicalRich('0');
            // Believeのがん先進医療特約「付加する」を押下した場合、他の先進医療特約を「付加しない」
            } else if (data.target.id == 'believe_premium_pay_period_21') {
                self.selectedCureAdvancedMedicalRich('0');
                self.selectedCureLadyAdvancedMedicalRich('0');
            }
            // Cureが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Cure以外の先進医療特約「付加しない」を押下した場合、Cureの先進医療特約「付加する」
            if (self.isSelectedCure() && self.selectedCureLadyAdvancedMedicalRich() == '0' && self.selectedBelieveCancerAdvancedMedicalRich() == '0' && (data.target.id == 'cure-l_advanced_medicine_22' || data.target.id == 'believe_premium_pay_period_22')) {
                self.selectedCureAdvancedMedicalRich('1');
            // CureLadyが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、CureLady以外の先進医療特約「付加しない」を押下した場合、CureLadyの先進医療特約「付加する」
            } else if (self.isSelectedCureLady() && self.selectedCureAdvancedMedicalRich() == '0' && self.selectedBelieveCancerAdvancedMedicalRich() == '0' && (data.target.id == 'cure_advanced_medicine_22' || data.target.id == 'believe_premium_pay_period_22')) {
                self.selectedCureLadyAdvancedMedicalRich('1');
            // Believeが選択状態、かつ、他の先進医療特約が「付加しない」、かつ、Believe以外の先進医療特約「付加しない」を押下した場合、Believeのがん先進医療特約「付加する」
            } else if (self.isSelectedBelieve() && self.selectedCureAdvancedMedicalRich() == '0' && self.selectedCureLadyAdvancedMedicalRich() == '0' && (data.target.id == 'cure_advanced_medicine_22' || data.target.id == 'cure-l_advanced_medicine_22')) {
                self.selectedBelieveCancerAdvancedMedicalRich('1');
            }
        }
    }

    /**
     * 先進医療特約設定
     * @method advancedMedicine
     */
    self.advancedMedicine =  function(){
        // シミュレーション種別が2の場合はreturn
        if (self.index() == '2') {
            return;
        }

        // 商品のチェックボックスが選択されているかどうか
        var hasCure = self.isSelectedCure() == '1' ? true : false;
        var hasCureLady = self.isSelectedCureLady() == '1' ? true : false;
        var hasCureSupport = self.isSelectedCureSupport() == '1' ? true : false;
        var hasReliefW = self.isSelectedReliefW() == '1' ? true : false;
        var hasBelieve = self.isSelectedBelieve() == '1' ? true : false;

        if (self.isSelectPlan()) {
            var count = 0;
            if (hasCure) count++;
            if (hasCureLady) count++;
            if (hasBelieve) count++;
            // Cure, CureLady, Believeのいずれかのチェックボックスを選択している場合
            if (count == 1) {
                // Cureのチェックボックスを選択している場合
                if (hasCure) {
                    // Cureの先進医療特約の「付加しない」を隠す
                    self.hideCureAdvancedMedicalBasic('0');
                    self.hideCureAdvancedMedicalRich('0');
                // CureLadyのチェックボックスを選択している場合
                } else if (hasCureLady) {
                    // CureLadyの先進医療特約の「付加しない」を隠す
                    self.hideCureLadyAdvancedMedicalBasic('0');
                    self.hideCureLadyAdvancedMedicalRich('0');
                // Believeのチェックボックスを選択している場合
                } else if (hasBelieve) {
                    // Believeの先進医療特約の「付加しない」を隠す
                    self.hideBelieveCancerAdvancedMedicalBasic('0');
                    self.hideBelieveCancerAdvancedMedicalRich('0');
                }
            } else {
                // Cure, CureLady, Believeの先進医療特約の「付加しない」を表示する
                self.hideCureAdvancedMedicalBasic('1');
                self.hideCureAdvancedMedicalRich('1');
                self.hideCureLadyAdvancedMedicalBasic('1');
                self.hideCureLadyAdvancedMedicalRich('1');
                self.hideBelieveCancerAdvancedMedicalBasic('1');
                self.hideBelieveCancerAdvancedMedicalRich('1');
            }
            // Cureのチェックボックスを選択していない場合
            if (!hasCure) {
                // Cureの先進医療特約を「付加しない」にチェック
                self.selectedCureAdvancedMedicalBasic('0');
                self.selectedCureAdvancedMedicalRich('0');
            }
            // CureLadyのチェックボックスを選択していない場合
            if (!hasCureLady) {
                // CureLadyの先進医療特約を「付加しない」にチェック
                self.selectedCureLadyAdvancedMedicalBasic('0');
                self.selectedCureLadyAdvancedMedicalRich('0');
            }
            // Believeのチェックボックスを選択していない場合
            if (!hasBelieve) {
                // Believeの先進医療特約を「付加しない」にチェック
                self.selectedBelieveCancerAdvancedMedicalBasic('0');
                self.selectedBelieveCancerAdvancedMedicalRich('0');
            }
            // 基本プランのCure, CureLady, Believeの先進医療特約がいずれも「付加する」でない場合
            if (self.selectedCureAdvancedMedicalBasic() != '1' && self.selectedCureLadyAdvancedMedicalBasic() != '1' && 
                self.selectedBelieveCancerAdvancedMedicalBasic() != '1') {
                // CureLadyのチェックボックスを選択している場合
                if (hasCureLady) {
                    // CureLadyの先進医療特約を「付加する」にチェック
                    self.selectedCureLadyAdvancedMedicalBasic('1');
                    // 全プラン再計算フラグをtrueにする
                    isSelectPlanAll = true;
                // Cureのチェックボックスを選択している場合
                } else if (hasCure) {
                    // Cureの先進医療特約を「付加する」にチェック
                    self.selectedCureAdvancedMedicalBasic('1');
                    // 全プラン再計算フラグをtrueにする
                    isSelectPlanAll = true;
                // Believeのチェックボックスを選択している場合
                } else if (hasBelieve) {
                    // Believeの先進医療特約を「付加する」にチェック
                    self.selectedBelieveCancerAdvancedMedicalBasic('1');
                    // 全プラン再計算フラグをtrueにする
                    isSelectPlanAll = true;
                }
            }
            // 充実プランのCure, CureLady, Believeの先進医療特約がいずれも「付加する」でない場合
            if (self.selectedCureAdvancedMedicalRich() != '1' && self.selectedCureLadyAdvancedMedicalRich() != '1' && 
                self.selectedBelieveCancerAdvancedMedicalRich() != '1') {
                // CureLadyのチェックボックスを選択している場合
                if (hasCureLady) {
                    // CureLadyの先進医療特約を「付加する」にチェック
                    self.selectedCureLadyAdvancedMedicalRich('1');
                // Cureのチェックボックスを選択している場合
                } else if (hasCure) {
                    // Cureの先進医療特約を「付加する」にチェック
                    self.selectedCureAdvancedMedicalRich('1');
                // Believeのチェックボックスを選択している場合
                } else if (hasBelieve) {
                    // Believeの先進医療特約を「付加する」にチェック
                    self.selectedBelieveCancerAdvancedMedicalRich('1');
                }
            }
            return;
        }

        var o = true;
        var x = false;

        // 各商品の組み合わせ
        // Cure、CureLady、CureSupport、ReliefW、Believeの順
        var matrix = [
            [o, x, x, x, x],
            [x, o, x, x, x],
            [x, x, o, x, x],
            [x, x, x, o, x],
            [x, x, x, x, o],
            [x, x, o, x, o],
            [x, o, x, x, o],
            [o, x, x, x, o],
            [o, x, x, o, x],
            [o, x, o, x, x],
            [o, o, x, x, x],
            [x, o, o, x, x],
            [x, o, x, o, x],
            [x, x, o, o, x],
            [x, x, x, o, o],
            [o, o, o, x, x],
            [o, x, o, o, x],
            [x, o, o, o, x],
            [x, o, o, x, o],
            [x, o, x, o, o],
            [x, x, o, o, o],
            [o, x, x, o, o],
            [o, x, o, x, o],
            [o, o, x, x, o],
            [x, o, o, o, o],
            [o, x, o, o, o],
            [o, o, o, x, o]
        ];
        for ( var i = 0; i < matrix.length; i++) {
            if (matrix[i][0] === hasCure && matrix[i][1] === hasCureLady
            && matrix[i][2] === hasCureSupport
            && matrix[i][3] === hasReliefW
            && matrix[i][4] === hasBelieve) {
                break;
            }
        }
        switch (i) {
            case 0:
                checkedCure();
                break;
            case 1:
                checkedCureLady();
                break;
            case 2:
                checkedCureSupport();
                break;
            case 3:
                checkedReliefw();
                break;
            case 4:
                break;
            case 5:
                showCureSupport();
                break;
            case 6:
                showCureLady();
                break;
            case 7:
                showCure();
                break;
            case 8:
                showCure();
                showReliefw();
                break;
            case 9:
                checkedCure();
                checkedCureSupport();
                break;
            case 10:
                showCure();
                showCureLady();
                break;
            case 11:
                checkedCureLady();
                checkedCureSupport();
                break;
            case 12:
                showCureLady();
                showReliefw();
                break;
            case 13:
                checkedCureSupport();
                checkedReliefw();
                break;
            case 14:
                showReliefw();
                break;
            case 15:
                showCure();
                showCureLady();
                checkedCureSupport();
                break;
            case 16:
                showCure();
                showReliefw();
                checkedCureSupport();
                break;
            case 17:
                showCureLady();
                showReliefw();
                checkedCureSupport();
                break;
            case 18:
                showCureLady();
                checkedCureSupport();
                break;
            case 19:
                showCureLady();
                showReliefw();
                break;
            case 20:
                showReliefw();
                checkedCureSupport();
                break;
            case 21:
                showCure();
                showReliefw();
                break;
            case 22:
                showCure();
                break;
            case 23:
                showCure();
                showCureLady();
                break;
            case 24:
                showCureLady();
                showReliefw();
                break;
            case 25:
                showCure();
                showReliefw();
                break;
            case 26:
                showCure();
                showCureLady();
                break;
            default:
                break;
        }

        // Cureの先進医療特約の「付加しない」を隠して、「付加する」にチェック
        function checkedCure() {
            self.hideCureAdvancedMedical('0');
            self.selectedCureAdvancedMedical('1');
        }
        // CureLadyの先進医療特約の「付加しない」を隠して、「付加する」にチェック
        function checkedCureLady() {
            self.hideCureLadyAdvancedMedical('0');
            self.selectedCureLadyAdvancedMedical('1');
        }
        // ReliefWの先進医療特約の「付加しない」を隠して、「付加する」にチェック
        function checkedReliefw() {
            self.hideReliefWAdvancedMedical('0');
            self.selectedReliefWAdvancedMedical('1');
        }
        // CureSupportの先進医療特約の「付加しない」を隠して、「付加する」にチェック
        function checkedCureSupport() {
            self.hideCureSupportRelaxationAdvancedMedical('0');
            self.selectedCureSupportRelaxationAdvancedMedical('1');
        }
        // Cureの先進医療特約の「付加する」「付加しない」を表示する
        function showCure() {
            self.hideCureAdvancedMedical('2');
        }
        // CureLadyの先進医療特約の「付加する」「付加しない」を表示する
        function showCureLady() {
            self.hideCureLadyAdvancedMedical('2');
        }
        // CureSupportの先進医療特約の「付加する」「付加しない」を表示する
        function showCureSupport() {
            self.hideCureSupportRelaxationAdvancedMedical('2');
        }
        // ReliefWの先進医療特約の「付加する」「付加しない」を表示する
        function showReliefw() {
            self.hideReliefWAdvancedMedical('2');
        }

        // Cureのチェックボックスを選択していない場合
        if (!hasCure) {
            // Cureの先進医療特約を「付加しない」にチェック
            self.selectedCureAdvancedMedical('0');
        }
        // CureLadyのチェックボックスを選択していない場合
        if (!hasCureLady) {
            // CureLadyの先進医療特約を「付加しない」にチェック
            self.selectedCureLadyAdvancedMedical('0');
        }
        // ReliefWのチェックボックスを選択していない場合
        if (!hasReliefW) {
        	// ReliefWの先進医療特約を「付加しない」にチェック
            self.selectedReliefWAdvancedMedical('0');
        }
        // Believeのチェックボックスを選択していない場合
        if (!hasBelieve) {
            // Believeのがん先進医療特約を「付加しない」にチェック
            self.selectedBelieveCancerAdvancedMedical('0');
        }

        // 以下の条件がすべて揃う場合
        // ・Cureのチェックボックスを選択、かつ、Cureの先進医療特約を「付加しない」　もしくは　Cureのチェックボックスを非選択
        // ・CureLadyのチェックボックスを選択、かつ、CureLadyの先進医療特約を「付加しない」　もしくは　CureLadyのチェックボックスを非選択
        // ・ReliefWのチェックボックスを選択、かつ、ReliefWの先進医療特約を「付加しない」　もしくは　ReliefWのチェックボックスを非選択
        // ・Believeのチェックボックスを選択、かつ、Believeのがん先進医療特約を「付加しない」　もしくは　Believeのチェックボックスを非選択
        if (
            ((hasCure && self.selectedCureAdvancedMedical() == '0') || !hasCure) &&
            ((hasCureLady && self.selectedCureLadyAdvancedMedical() == '0') || !hasCureLady) &&
            ((hasReliefW && self.selectedReliefWAdvancedMedical() == '0') || !hasReliefW) &&
            ((hasBelieve && self.selectedBelieveCancerAdvancedMedical() == '0') || !hasBelieve)
        ) {
            // Cureのチェックボックスを選択している場合
            if (hasCure) {
                // Cureの先進医療特約を「付加する」にチェック
                self.selectedCureAdvancedMedical('1');
            // CureLadyのチェックボックスを選択している場合
            } else if (hasCureLady) {
                // CureLadyの先進医療特約を「付加する」にチェック
                self.selectedCureLadyAdvancedMedical('1');
            // ReliefWのチェックボックスを選択している場合
            } else if (hasReliefW) {
                // ReliefWの先進医療特約を「付加する」にチェック
                self.selectedReliefWAdvancedMedical('1');
            // Believeのチェックボックスを選択している場合
            } else if (hasBelieve) {
                // Believeのがん先進医療特約を「付加する」にチェック
                self.selectedBelieveCancerAdvancedMedical('1');
            }
        }

        // Believeがん先進医療特約が、「付加する」にチェックがついている場合
        if (self.selectedBelieveCancerAdvancedMedical() == '1') {
            // CureSupportの先進医療特約の「付加する」を隠す
            self.hideCureSupportRelaxationAdvancedMedical('1');
            // CureSupportの先進医療特約を「付加しない」にチェック
            self.selectedCureSupportRelaxationAdvancedMedical('0');
        } else {
            // CureSupportの先進医療特約の「付加しない」を隠す
            self.hideCureSupportRelaxationAdvancedMedical('0');
            // CureSupportの先進医療特約を「付加する」にチェック
            self.selectedCureSupportRelaxationAdvancedMedical('1');
        }
    }

    /**
     * おすすめ商品のCureLady入院給付金日額（充実プラン）の値を設定します
     * @method setCureLadyHospitalAmounRich
     */
    self.setCureLadyHospitalAmounRich = function() {
        if (self.isSelectPlan() && 61 <= self.contractAge() && self.contractAge() <= 75 && self.selectedGender() == '2') {
            // 入院給付金日額を5000だけに変更
            var option = [{"text": "5,000円", "value": "5000"}];
            self.cureLadyHospitalAmountRich(option);

        } else if (self.isSelectPlan() && self.selectedGender() == '2') {
            // 入院給付金日額を10000だけに変更
            var option = [{"text": "10,000円", "value": "10000"}];
            self.cureLadyHospitalAmountRich(option);
        }
    }

    /**
     * CureSupportの引受基準緩和型終身保険特約を生成します
     * @method setCureSupportRelaxationLifetimeInsurance
     */
    self.setCureSupportRelaxationLifetimeInsurance = function() {
        var isInsurance;

        // indexが2の場合
        if (self.index() == '2') {
            // プルダウンの中身を年齢ごとに生成する
            isInsurance　= true;
        } else if ((!self.isSelectedReliefW() && (self.isSelectedCure() || self.isSelectedCureLady())) || self.isSelectedBridge() || self.isSelectedKeep()) {
            // プルダウンの中身を「付加しない」だけにする
            isInsurance　= false;
        } else {
            // プルダウンの中身を年齢ごとに生成する
            isInsurance　= true;
        }

        // 選択されたCureSupport引受基準緩和型終身保険特約
        var select = self.selectedCureSupportRelaxationLifetimeInsurance();

        // 20歳～39歳
        if ("20" <= self.contractAge() && self.contractAge() <= "39") {
            // フラグがある場合
            if (isInsurance) {
                // 引受基準緩和型終身保険特約のプルダウンの中身を作成
                createSelectBox(100, 1500, 50, '万円');
                if (select == "50") {
                    // 選択された引受基準緩和型終身保険特約が、50を選択している場合は100に変更
                    self.selectedCureSupportRelaxationLifetimeInsurance("100");
                } else {
                    // プルダウンの中身を作成したので、値を詰めなおす
                    self.selectedCureSupportRelaxationLifetimeInsurance(select);
                }
            } else {
                // 引受基準緩和型終身保険特約を「付加しない」だけにする
                var option = [{"text": "付加しない", "value": "0"}];
                self.cureSupportRelaxationLifetimeInsurance(option);
            }
        // 40歳～49歳
        } else if ("40" <= self.contractAge() && self.contractAge() <= "49") {
            // フラグがある場合
            if (isInsurance) {
                // 引受基準緩和型終身保険特約のプルダウンの中身を作成
                createSelectBox(100, 1000, 50, '万円');
                if (select == "50") {
                    self.selectedCureSupportRelaxationLifetimeInsurance("100");
                } else if (select > "1000") {
                    // 選択された引受基準緩和型終身保険特約が、1000より上を選択している場合は1000に変更
                    self.selectedCureSupportRelaxationLifetimeInsurance("1000");
                } else {
                    // プルダウンの中身を作成したので、値を詰めなおす
                    self.selectedCureSupportRelaxationLifetimeInsurance(select);
                }
            } else {
                // 引受基準緩和型終身保険特約を「付加しない」だけにする
                var option = [{"text": "付加しない", "value": "0"}];
                self.cureSupportRelaxationLifetimeInsurance(option);
            }
        // 50歳～80歳
        } else if ("50" <= self.contractAge() && self.contractAge() <= "80") {
            // フラグがある場合
            if (isInsurance) {
                // 引受基準緩和型終身保険特約のプルダウンの中身を作成
                createSelectBox(50, 1000, 50, '万円');
                if (select > 1000) {
                    // 選択された引受基準緩和型終身保険特約が、1000より上を選択している場合は1000に変更
                    self.selectedCureSupportRelaxationLifetimeInsurance("1000");
                } else {
                    // プルダウンの中身を作成したので、値を詰めなおす
                    self.selectedCureSupportRelaxationLifetimeInsurance(select);
                }
            } else {
                // 引受基準緩和型終身保険特約を「付加しない」だけにする
                var option = [{"text": "付加しない", "value": "0"}];
                self.cureSupportRelaxationLifetimeInsurance(option);
            }
        }

        /**
         * 引受基準緩和型終身保険特約のセレクトボックスを生成します
         * @param int start 開始数
         * @param int end 終了数
         * @param int plus 繰り返す数
         * @param string|undefined postfix 接尾語
         */
        function createSelectBox(start, end, plus, postfix) {
            // 初期値
            var option = [{"text": "付加しない", "value": "0"}];
            for ( var i = start; i <= end; i = i + plus) {
                option.push({"text": String(i).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ) + postfix, "value": i});
            }
            self.cureSupportRelaxationLifetimeInsurance(option);
        }
    }

    /**
     * 各保険の選択状態を一時保存して初期化、選択可否フラグをセット
     * @method tempSelectState
     * @param product {Object} コピーした商品データ構造
     */
    self.tempSelectState = function(product) {
        switch (product.productCd) {
            case "3G":
                self.selectableBridge(product.selectable);
                tempIsSelectedBridge = product.isSelected
                self.isSelectedBridge(false);
                break;
            case "37":
                self.selectableFineSave(product.selectable);
                tempIsSelectedFineSave = product.isSelected
                self.isSelectedFineSave(false);
                break;
            case "3F":
                self.selectableKeep(product.selectable);
                tempIsSelectedKeep = product.isSelected
                self.isSelectedKeep(false);
                break;
            case "4C":
                self.selectableCure(product.selectable);
                tempIsSelectedCure = product.isSelected
                self.isSelectedCure(false);
                break;
            case "4A":
                self.selectableCureLady(product.selectable);
                tempIsSelectedCureLady = product.isSelected
                self.isSelectedCureLady(false);
                break;
            case "1P":
                self.selectableReliefW(product.selectable);
                tempIsSelectedReliefW = product.isSelected
                self.isSelectedReliefW(false);
                break;
            case "1V":
                self.selectableBelieve(product.selectable);
                tempIsSelectedBelieve = product.isSelected
                self.isSelectedBelieve(false);
                break;
            case "1W":
                self.selectableCureSupport(product.selectable);
                tempIsSelectedCureSupport = product.isSelected
                self.isSelectedCureSupport(false);
                break;
            case "1Y":
                self.selectableRiseSupport(product.selectable);
                tempIsSelectedRiseSupport = product.isSelected
                self.isSelectedRiseSupport(false);
                break;
            default:
                break;
        }
    }

    /**
     * 各保険の選択状態を一時保存状態から元に戻す
     * @method restoreSelectState
     * @param product {Object} 商品データ構造
     */
    self.restoreSelectState = function(product) {

        switch (product.productCd) {
            case "3G":
                self.isSelectedBridge(tempIsSelectedBridge);
                break;
            case "37":
                self.isSelectedFineSave(tempIsSelectedFineSave);
                break;
            case "3F":
                self.isSelectedKeep(tempIsSelectedKeep);
                break;
            case "4C":
                self.isSelectedCure(tempIsSelectedCure);
                break;
            case "4A":
                self.isSelectedCureLady(tempIsSelectedCureLady);
                break;
            case "1P":
                self.isSelectedReliefW(tempIsSelectedReliefW);
                break;
            case "1V":
                self.isSelectedBelieve(tempIsSelectedBelieve);
                break;
            case "1W":
                self.isSelectedCureSupport(tempIsSelectedCureSupport);
                break;
            case "1Y":
                self.isSelectedRiseSupport(tempIsSelectedRiseSupport);
                break;
            default:
                break;
        }
    }

    /**
     * 各保険の選択状態を設定
     * @method setSelectState
     * @param product {Object} 商品データ構造
     */
    self.setSelectState = function(product) {

        switch (product.productCd) {
            case "3G":
                // if (product.isCalcTarget) {
                    self.selectableBridge(product.selectable);
                    self.isSelectedBridge(product.isSelected);
                // }
                break;
            case "37":
                // if (product.isCalcTarget) {
                    self.selectableFineSave(product.selectable);
                    self.isSelectedFineSave(product.isSelected);
                // }
                break;
            case "3F":
                // if (product.isCalcTarget) {
                    self.selectableKeep(product.selectable);
                    self.isSelectedKeep(product.isSelected);
                // }
                break;
            case "4C":
                // if (product.isCalcTarget) {
                    self.selectableCure(product.selectable);
                    self.isSelectedCure(product.isSelected);
                // }
                break;
            case "4A":
                // if (product.isCalcTarget) {
                    self.selectableCureLady(product.selectable);
                    self.isSelectedCureLady(product.isSelected);
                // }
                break;
            case "1P":
                // if (product.isCalcTarget) {
                    self.selectableReliefW(product.selectable);
                    self.isSelectedReliefW(product.isSelected);
                // }
                break;
            case "1V":
                // if (product.isCalcTarget) {
                    self.selectableBelieve(product.selectable);
                    self.isSelectedBelieve(product.isSelected);
                // }
                break;
            case "1W":
                // if (product.isCalcTarget) {
                    self.selectableCureSupport(product.selectable);
                    self.isSelectedCureSupport(product.isSelected);
                // }
                break;
            case "1Y":
                // if (product.isCalcTarget) {
                    self.selectableRiseSupport(product.selectable);
                    self.isSelectedRiseSupport(product.isSelected);
                // }
                break;
            default:
                break;
        }
    }

    /**
     * 保険の選択状態をself.plan()に反映させる
     * @method setPlanData
     *
     */
    self.setPlanData = function() {
        // 保険の選択状態を設定
        ko.utils.arrayForEach(self.plan().products, function(product){
            switch (product.productCd) {
                case "3G":
                    // Bridge選択フラグをobservableに設定
                    product.selectable = self.selectableBridge();
                    product.isSelected = self.isSelectedBridge();
                    break;
                case "37":
                    // Finesave選択フラグをobservableに設定
                    product.selectable = self.selectableFineSave();
                    product.isSelected = self.isSelectedFineSave();
                    break;
                case "3F":
                    // Keep選択フラグをobservableに設定
                    product.selectable = self.selectableKeep();
                    product.isSelected = self.isSelectedKeep();
                    break;
                case "4C":
                    // Cure選択フラグをobservableに設定
                    product.selectable = self.selectableCure();
                    product.isSelected = self.isSelectedCure();
                    break;
                case "4A":
                    // CureLady選択フラグをobservableに設定
                    product.selectable = self.selectableCureLady();
                    product.isSelected = self.isSelectedCureLady();
                    break;
                case "1P":
                    // ReliefW選択フラグをobservableに設定
                    product.selectable = self.selectableReliefW();
                    product.isSelected = self.isSelectedReliefW();
                    break;
                case "1V":
                    // Believe選択フラグをobservableに設定
                    product.selectable = self.selectableBelieve();
                    product.isSelected = self.isSelectedBelieve();
                    break;
                case "1W":
                    // CureSupport選択フラグをobservableに設定
                    product.selectable = self.selectableCureSupport();
                    product.isSelected = self.isSelectedCureSupport();
                    break;
                case "1Y":
                    // RiseSupport選択フラグをobservableに設定
                    product.selectable = self.selectableRiseSupport();
                    product.isSelected = self.isSelectedRiseSupport();
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 商品固有情報を画面に設定
     * @method setProductInfo
     */
    self.setProductInfo = function(){
        // 商品固有情報をobservableに設定
        ko.utils.arrayForEach(self.plan().products, function(product){
            switch (product.productCd) {
                case "3G":
                    // Bridgeの商品固有情報をobservableに設定
                    self.setBridgeProductInfo(product.plans);
                    break;
                case "37":
                    // Finesaveの商品固有情報をobservableに設定
                    self.setFineSaveProductInfo(product.plans);
                    break;
                case "3F":
                    // Keepの商品固有情報をobservableに設定
                    self.setKeepProductInfo(product.plans);
                    break;
                case "4C":
                    // Cureの商品固有情報をobservableに設定
                    self.setCureProductInfo(product.plans);
                    break;
                case "4A":
                    // CureLadyの商品固有情報をobservableに設定
                    self.setCureLadyProductInfo(product.plans);
                    break;
                case "1P":
                    // ReliefWの商品固有情報をobservableに設定
                    self.setReliefWProductInfo(product.plans);
                    break;
                case "1V":
                    // Believeの商品固有情報をobservableに設定
                    self.setBelieveProductInfo(product.plans);
                    break;
                case "1W":
                    // CureSupportの商品固有情報をobservableに設定
                    self.setCureSupportProductInfo(product.plans);
                    break;
                case "1Y":
                    // RiseSupportの商品固有情報をobservableに設定
                    self.setRiseSupportProductInfo(product.plans);
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Bridge保険金額・保険期間プルダウン設定
     * @method createBridgeProductInfo
     * @param bridgePlans {Object} 商品データ構造のうちbridgeの部分
     */
    self.createBridgeProductInfo = function(bridgePlans){
        // 全商品の場合
        if (self.isFreePlan()) {
            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.standard.productInfo.insuranceAmount.length == 0) {
                var option = [{"text": "", "value": bridgePlans.standard.productInfo.selectedInsuranceAmount}];
                // 保険金額
                self.bridgeInsuranceAmount(option);
            } else {
                // 保険金額
                self.bridgeInsuranceAmount(bridgePlans.standard.productInfo.insuranceAmount);
            }

            // 選択された保険金額
            self.selectedBridgeInsuranceAmount(bridgePlans.standard.productInfo.selectedInsuranceAmount);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.standard.productInfo.insurancePeriod.length == 0) {
                var option = [{"text": "", "value": bridgePlans.standard.productInfo.selectedInsurancePeriod}];
                // 保険期間
                self.bridgeInsurancePeriod(option);
            } else {
                // 保険期間
                self.bridgeInsurancePeriod(bridgePlans.standard.productInfo.insurancePeriod);
            }

            // 選択された保険期間
            self.selectedBridgeInsurancePeriod(bridgePlans.standard.productInfo.selectedInsurancePeriod);
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.basic.productInfo.insuranceAmount.length == 0) {
                var option = [{"text": "", "value": bridgePlans.basic.productInfo.selectedInsuranceAmount}];
                // 保険金額（基本プラン）
                self.bridgeInsuranceAmountBasic(option);
            } else {
                // 保険金額（基本プラン）
                self.bridgeInsuranceAmountBasic(bridgePlans.basic.productInfo.insuranceAmount);
            }

            // 選択された保険金額（基本プラン）
            self.selectedBridgeInsuranceAmountBasic(bridgePlans.basic.productInfo.selectedInsuranceAmount);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.basic.productInfo.insurancePeriod.length == 0) {
                var option = [{"text": "", "value": bridgePlans.basic.productInfo.selectedInsurancePeriod}];
                // 保険期間（基本プラン）
                self.bridgeInsurancePeriodBasic(option);
            } else {
                // 保険期間（基本プラン）
                self.bridgeInsurancePeriodBasic(bridgePlans.basic.productInfo.insurancePeriod);
            }

            // 選択された保険期間（基本プラン）
            self.selectedBridgeInsurancePeriodBasic(bridgePlans.basic.productInfo.selectedInsurancePeriod);


            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.rich.productInfo.insuranceAmount.length == 0) {
                var option = [{"text": "", "value": bridgePlans.rich.productInfo.selectedInsuranceAmount}];
                // 保険金額（充実プラン）
                self.bridgeInsuranceAmountRich(option);
            } else {
                // 保険金額（充実プラン）
                self.bridgeInsuranceAmountRich(bridgePlans.rich.productInfo.insuranceAmount);
            }

            // 選択された保険金額（充実プラン）
            self.selectedBridgeInsuranceAmountRich(bridgePlans.rich.productInfo.selectedInsuranceAmount);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (bridgePlans.rich.productInfo.insurancePeriod.length == 0) {
                var option = [{"text": "", "value": bridgePlans.rich.productInfo.selectedInsurancePeriod}];
                // 保険期間（充実プラン）
                self.bridgeInsurancePeriodRich(option);
            } else {
                // 保険期間（充実プラン）
                self.bridgeInsurancePeriodRich(bridgePlans.rich.productInfo.insurancePeriod);
            }

            // 選択された保険期間（充実プラン）
            self.selectedBridgeInsurancePeriodRich(bridgePlans.rich.productInfo.selectedInsurancePeriod);
        }
    }

    /**
     * Bridgeの商品固有情報をobservableに設定
     * @method setBridgeProductInfo
     * @param bridgePlans {Object} 商品データ構造のうちbridgeの部分
     */
    self.setBridgeProductInfo = function(bridgePlans){
        // 全商品の場合
        if (self.isFreePlan()) {
            // 保険金額
            bridgePlans.standard.productInfo.insuranceAmount = self.bridgeInsuranceAmount();

            // 選択された保険金額
            bridgePlans.standard.productInfo.selectedInsuranceAmount = self.selectedBridgeInsuranceAmount();

            // 保険期間
            bridgePlans.standard.productInfo.insurancePeriod = self.bridgeInsurancePeriod();

            // 選択された保険期間
            bridgePlans.standard.productInfo.selectedInsurancePeriod = self.selectedBridgeInsurancePeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 保険金額（基本プラン）
            bridgePlans.basic.productInfo.insuranceAmount = self.bridgeInsuranceAmountBasic();

            // 選択された保険金額（基本プラン）
            bridgePlans.basic.productInfo.selectedInsuranceAmount = self.selectedBridgeInsuranceAmountBasic();

            // 保険期間（基本プラン）
            bridgePlans.basic.productInfo.insurancePeriod = self.bridgeInsurancePeriodBasic();

            // 選択された保険期間（基本プラン）
            bridgePlans.basic.productInfo.selectedInsurancePeriod = self.selectedBridgeInsurancePeriodBasic();


            // 保険金額（充実プラン）
            bridgePlans.rich.productInfo.insuranceAmount = self.bridgeInsuranceAmountRich();

            // 選択された保険金額（充実プラン）
            bridgePlans.rich.productInfo.selectedInsuranceAmount = self.selectedBridgeInsuranceAmountRich();

            // 保険期間（充実プラン）
            bridgePlans.rich.productInfo.insurancePeriod = self.bridgeInsurancePeriodRich();

            // 選択された保険期間（充実プラン）
            bridgePlans.rich.productInfo.selectedInsurancePeriod = self.selectedBridgeInsurancePeriodRich();
        }
    }

    /**
     * FineSave保険金額・保険期間プルダウン設定
     * @method createFineSaveProductInfo
     * @param fineSavePlans {Object} 商品データ構造のうちFineSaveの部分
     */
    self.createFineSaveProductInfo = function(fineSavePlans){
        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (fineSavePlans.standard.productInfo.insuranceAmount.length == 0) {
            var option = [{"text": "", "value": fineSavePlans.standard.productInfo.selectedInsuranceAmount}];
            // 保険金額
            self.fineSaveInsuranceAmount(option);
        } else {
            // 保険金額
            self.fineSaveInsuranceAmount(fineSavePlans.standard.productInfo.insuranceAmount);
        }

        // 選択された保険金額
        self.selectedFineSaveInsuranceAmount(fineSavePlans.standard.productInfo.selectedInsuranceAmount);

        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (fineSavePlans.standard.productInfo.insurancePeriod.length == 0) {
            var option = [{"text": "", "value": fineSavePlans.standard.productInfo.selectedInsurancePeriod}];
            // 保険期間
            self.fineSaveInsurancePeriod(option);
        } else {
            // 保険期間
            self.fineSaveInsurancePeriod(fineSavePlans.standard.productInfo.insurancePeriod);
        }

        // 選択された保険期間
        self.selectedFineSaveInsurancePeriod(fineSavePlans.standard.productInfo.selectedInsurancePeriod);
    }

    /**
     * FineSaveの商品固有情報をobservableに設定
     * @method setFineSaveProductInfo
     * @param fineSavePlans {Object} 商品データ構造のうちFineSaveの部分
     */
    self.setFineSaveProductInfo = function(fineSavePlans){
        // 保険金額
        fineSavePlans.standard.productInfo.insuranceAmount = self.fineSaveInsuranceAmount();

        // 選択された保険金額
        fineSavePlans.standard.productInfo.selectedInsuranceAmount　= self.selectedFineSaveInsuranceAmount();

        // 保険期間
        fineSavePlans.standard.productInfo.insurancePeriod = self.fineSaveInsurancePeriod();

        // 選択された保険期間
        fineSavePlans.standard.productInfo.selectedInsurancePeriod = self.selectedFineSaveInsurancePeriod();
    }

    /**
     * Keepの商品固有情報設定
     * @method createKeepProductInfo
     * @param keepPlans {Object} 商品データ構造のうちKeepの部分
     */
    self.createKeepProductInfo = function(keepPlans) {
        // 一括受取金額
        self.keepBenefitLumpPay(keepPlans.standard.productInfo.benefitLumpPay);

        // 年金月額
        self.keepMonthlyPension(keepPlans.standard.productInfo.monthlyPension);

        // 選択された年金月額
        self.selectedKeepMonthlyPension(String(keepPlans.standard.productInfo.selectedMonthlyPension));

        // 支払保証期間（1年・5年）のdisableフラグ
        i = 1;
        ko.utils.arrayForEach(keepPlans.standard.productInfo.paymentGuranteePeriod, function(paymentGuaranteePeriod){
            if (i == 1) {
                self.keepPaymentGuaranteePeriodFlg1(paymentGuaranteePeriod.isEnable);
            } else if (i == 2) {
                self.keepPaymentGuaranteePeriodFlg2(paymentGuaranteePeriod.isEnable);
                return;
            }
            i++;
        });

        // 選択された支払保証期間
        self.selectedKeepPaymentGuaranteePeriod(keepPlans.standard.productInfo.selectedPaymentGuranteePeriod);

        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (keepPlans.standard.productInfo.insurancePeriod.length == 0) {
            var option = [{"text": "", "value": keepPlans.standard.productInfo.selectedInsurancePeriod}];
            // 保険期間
            self.keepInsurancePeriod(option);
        } else {
            // 保険期間
            self.keepInsurancePeriod(keepPlans.standard.productInfo.insurancePeriod);
        }

        // 選択された保険期間
        self.selectedKeepInsurancePeriod(keepPlans.standard.productInfo.selectedInsurancePeriod);
    }

    /**
     * Keepの商品固有情報をobservableに設定
     * @method setKeepProductInfo
     * @param keepPlans {Object} 商品データ構造のうちKeepの部分
     */
    self.setKeepProductInfo = function(keepPlans) {
        // 選択された年金月額
        keepPlans.standard.productInfo.selectedMonthlyPension = self.selectedKeepMonthlyPension();

        // 選択された支払保証期間
        keepPlans.standard.productInfo.selectedPaymentGuranteePeriod = self.selectedKeepPaymentGuaranteePeriod();

        // 選択された保険期間
        keepPlans.standard.productInfo.selectedInsurancePeriod = self.selectedKeepInsurancePeriod();
    }

    /**
     * Cureの商品固有情報設定
     * @method createCureProductInfo
     * @param curePlans {Object} 商品データ構造のうちCureの部分
     */
    self.createCureProductInfo = function(curePlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された入院給付金日額
            self.selectedCureHospitalAmount(curePlans.standard.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約
            self.selectedCureAdvancedMedical(curePlans.standard.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約
            self.selectedCureCancerOption(curePlans.standard.productInfo.selectedCancerOption);

            // 選択されたがん通院特約
            self.selectedCureCancerOutpatient(curePlans.standard.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (curePlans.standard.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": curePlans.standard.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間
                self.cureInsurancePaymentPeriod(option);
            } else {
                // 保険料払込期間
                self.cureInsurancePaymentPeriod(curePlans.standard.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値
            self.selectedCureInsurancePaymentPeriod(curePlans.standard.productInfo.selectedInsurancePaymentPeriod);
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (curePlans.basic.productInfo.hospitalAmount.length == 0) {
                var option = [{"text": "", "value": curePlans.basic.productInfo.selectedHospitalAmount}];
                // 入院給付金日額（基本プラン）
                self.cureHospitalAmountBasic(option);
            } else {
                // 入院給付金日額（基本プラン）
                self.cureHospitalAmountBasic(curePlans.basic.productInfo.hospitalAmount);
            }

            // 選択された入院給付金日額（基本プラン）
            self.selectedCureHospitalAmountBasic(curePlans.basic.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約（基本プラン）
            self.selectedCureAdvancedMedicalBasic(curePlans.basic.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約（基本プラン）
            self.selectedCureCancerOptionBasic(curePlans.basic.productInfo.selectedCancerOption);

            // 選択されたがん通院特約（基本プラン）
            self.selectedCureCancerOutpatientBasic(curePlans.basic.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (curePlans.basic.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": curePlans.basic.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（基本プラン）
                self.cureInsurancePaymentPeriodBasic(option);
            } else {
                // 保険料払込期間（基本プラン）
                self.cureInsurancePaymentPeriodBasic(curePlans.basic.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（基本プラン）
            self.selectedCureInsurancePaymentPeriodBasic(curePlans.basic.productInfo.selectedInsurancePaymentPeriod);


            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (curePlans.rich.productInfo.hospitalAmount.length == 0) {
                var option = [{"text": "", "value": curePlans.rich.productInfo.selectedHospitalAmount}];
                // 入院給付金日額（充実プラン）
                self.cureHospitalAmountRich(option);
            } else {
                // 入院給付金日額（充実プラン）
                self.cureHospitalAmountRich(curePlans.rich.productInfo.hospitalAmount);
            }

            // 選択された入院給付金日額（充実プラン）
            self.selectedCureHospitalAmountRich(curePlans.rich.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約（充実プラン）
            self.selectedCureAdvancedMedicalRich(curePlans.rich.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約（充実プラン）
            self.selectedCureCancerOptionRich(curePlans.rich.productInfo.selectedCancerOption);

            // 選択されたがん通院特約（充実プラン）
            self.selectedCureCancerOutpatientRich(curePlans.rich.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (curePlans.rich.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": curePlans.rich.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（充実プラン）
                self.cureInsurancePaymentPeriodRich(option);
            } else {
                // 保険料払込期間（充実プラン）
                self.cureInsurancePaymentPeriodRich(curePlans.rich.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（充実プラン）
            self.selectedCureInsurancePaymentPeriodRich(curePlans.rich.productInfo.selectedInsurancePaymentPeriod);
        }
    }

    /**
     * Cureの商品固有情報をobservableに設定
     * @method setCureProductInfo
     * @param curePlans {Object} 商品データ構造のうちCureの部分
     */
    self.setCureProductInfo = function(curePlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された入院給付金日額
            curePlans.standard.productInfo.selectedHospitalAmount = self.selectedCureHospitalAmount();

            // 選択された先進医療特約
            curePlans.standard.productInfo.selectedAdvancedMedical = self.selectedCureAdvancedMedical();

            // 選択されたがん診断治療給付金特約
            curePlans.standard.productInfo.selectedCancerOption = self.selectedCureCancerOption();

            // 選択されたがん通院特約
            curePlans.standard.productInfo.selectedCancerOutpatient = self.selectedCureCancerOutpatient();

            // 選択された保険料払込期間の初期値
            curePlans.standard.productInfo.selectedInsurancePaymentPeriod = self.selectedCureInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 選択された入院給付金日額（基本プラン）
            curePlans.basic.productInfo.selectedHospitalAmount = self.selectedCureHospitalAmountBasic();

            // 選択された先進医療特約（基本プラン）
            curePlans.basic.productInfo.selectedAdvancedMedical = self.selectedCureAdvancedMedicalBasic();

            // 選択されたがん診断治療給付金特約（基本プラン）
            curePlans.basic.productInfo.selectedCancerOption = self.selectedCureCancerOptionBasic();

            // 選択されたがん通院特約（基本プラン）
            curePlans.basic.productInfo.selectedCancerOutpatient = self.selectedCureCancerOutpatientBasic();

            // 選択された保険料払込期間の初期値（基本プラン）
            curePlans.basic.productInfo.selectedInsurancePaymentPeriod = self.selectedCureInsurancePaymentPeriodBasic();

            // 選択された入院給付金日額（充実プラン）
            curePlans.rich.productInfo.selectedHospitalAmount = self.selectedCureHospitalAmountRich();

            // 選択された先進医療特約（充実プラン）
            curePlans.rich.productInfo.selectedAdvancedMedical = self.selectedCureAdvancedMedicalRich();

            // 選択されたがん診断治療給付金特約（充実プラン）
            curePlans.rich.productInfo.selectedCancerOption = self.selectedCureCancerOptionRich();

            // 選択されたがん通院特約（充実プラン）
            curePlans.rich.productInfo.selectedCancerOutpatient = self.selectedCureCancerOutpatientRich();

            // 選択された保険料払込期間の初期値（充実プラン）
            curePlans.rich.productInfo.selectedInsurancePaymentPeriod = self.selectedCureInsurancePaymentPeriodRich();
        }
    }

    /**
     * CureLadyの商品固有情報設定
     * @method createCureLadyProductInfo
     * @param cureLadyPlans {Object} 商品データ構造のうちCureLadyの部分
     */
    self.createCureLadyProductInfo = function(cureLadyPlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された入院給付金日額
            self.selectedCureLadyHospitalAmount(cureLadyPlans.standard.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約
            self.selectedCureLadyAdvancedMedical(cureLadyPlans.standard.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約
            self.selectedCureLadyCancerOption(cureLadyPlans.standard.productInfo.selectedCancerOption);

            // 選択されたがん通院特約
            self.selectedCureLadyCancerOutpatient(cureLadyPlans.standard.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (cureLadyPlans.standard.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": cureLadyPlans.standard.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間
                self.cureLadyInsurancePaymentPeriod(option);
            } else {
                // 保険料払込期間
                self.cureLadyInsurancePaymentPeriod(cureLadyPlans.standard.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値
            self.selectedCureLadyInsurancePaymentPeriod(cureLadyPlans.standard.productInfo.selectedInsurancePaymentPeriod);
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (cureLadyPlans.basic.productInfo.hospitalAmount.length == 0) {
                var option = [{"text": "", "value": cureLadyPlans.basic.productInfo.selectedHospitalAmount}];
                // 入院給付金日額（基本プラン）
                self.cureLadyHospitalAmountBasic(option);
            } else {
                // 入院給付金日額（基本プラン）
                self.cureLadyHospitalAmountBasic(cureLadyPlans.basic.productInfo.hospitalAmount);
            }

            // 選択された入院給付金日額（基本プラン）
            self.selectedCureLadyHospitalAmountBasic(cureLadyPlans.basic.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約（基本プラン）
            self.selectedCureLadyAdvancedMedicalBasic(cureLadyPlans.basic.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約（基本プラン）
            self.selectedCureLadyCancerOptionBasic(cureLadyPlans.basic.productInfo.selectedCancerOption);

            // 選択されたがん通院特約（基本プラン）
            self.selectedCureLadyCancerOutpatientBasic(cureLadyPlans.basic.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (cureLadyPlans.basic.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": cureLadyPlans.basic.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（基本プラン）
                self.cureLadyInsurancePaymentPeriodBasic(option);
            } else {
                // 保険料払込期間（基本プラン）
                self.cureLadyInsurancePaymentPeriodBasic(cureLadyPlans.basic.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（基本プラン）
            self.selectedCureLadyInsurancePaymentPeriodBasic(cureLadyPlans.basic.productInfo.selectedInsurancePaymentPeriod);


            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (cureLadyPlans.rich.productInfo.hospitalAmount.length == 0) {
                var option = [{"text": "", "value": cureLadyPlans.rich.productInfo.selectedHospitalAmount}];
                // 入院給付金日額（充実プラン）
                self.cureLadyHospitalAmountRich(option);
            } else {
                // 入院給付金日額（充実プラン）
                self.cureLadyHospitalAmountRich(cureLadyPlans.rich.productInfo.hospitalAmount);
            }

            // 選択された入院給付金日額（充実プラン）
            self.selectedCureLadyHospitalAmountRich(cureLadyPlans.rich.productInfo.selectedHospitalAmount);

            // 選択された先進医療特約（充実プラン）
            self.selectedCureLadyAdvancedMedicalRich(cureLadyPlans.rich.productInfo.selectedAdvancedMedical);

            // 選択されたがん診断治療給付金特約（充実プラン）
            self.selectedCureLadyCancerOptionRich(cureLadyPlans.rich.productInfo.selectedCancerOption);

            // 選択されたがん通院特約（充実プラン）
            self.selectedCureLadyCancerOutpatientRich(cureLadyPlans.rich.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (cureLadyPlans.rich.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": cureLadyPlans.rich.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（充実プラン）
                self.cureLadyInsurancePaymentPeriodRich(option);
            } else {
                // 保険料払込期間（充実プラン）
                self.cureLadyInsurancePaymentPeriodRich(cureLadyPlans.rich.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（充実プラン）
            self.selectedCureLadyInsurancePaymentPeriodRich(cureLadyPlans.rich.productInfo.selectedInsurancePaymentPeriod);
        }
    }

    /**
     * CureLadyの商品固有情報をobservableに設定
     * @method setCureLadyProductInfo
     * @param cureLadyPlans {Object} 商品データ構造のうちCureLadyの部分
     */
    self.setCureLadyProductInfo = function(cureLadyPlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された入院給付金日額
            cureLadyPlans.standard.productInfo.selectedHospitalAmount　= self.selectedCureLadyHospitalAmount();

            // 選択された先進医療特約
            cureLadyPlans.standard.productInfo.selectedAdvancedMedical = self.selectedCureLadyAdvancedMedical();

            // 選択されたがん診断治療給付金特約
            cureLadyPlans.standard.productInfo.selectedCancerOption = self.selectedCureLadyCancerOption();

            // 選択されたがん通院特約
            cureLadyPlans.standard.productInfo.selectedCancerOutpatient = self.selectedCureLadyCancerOutpatient();

            // 選択された保険料払込期間の初期値
            cureLadyPlans.standard.productInfo.selectedInsurancePaymentPeriod = self.selectedCureLadyInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 選択された入院給付金日額（基本プラン）
            cureLadyPlans.basic.productInfo.selectedHospitalAmount = self.selectedCureLadyHospitalAmountBasic();

            // 選択された先進医療特約（基本プラン）
            cureLadyPlans.basic.productInfo.selectedAdvancedMedical = self.selectedCureLadyAdvancedMedicalBasic();

            // 選択されたがん診断治療給付金特約（基本プラン）
            cureLadyPlans.basic.productInfo.selectedCancerOption = self.selectedCureLadyCancerOptionBasic();

            // 選択されたがん通院特約（基本プラン）
            cureLadyPlans.basic.productInfo.selectedCancerOutpatient = self.selectedCureLadyCancerOutpatientBasic();

            // 選択された保険料払込期間の初期値（基本プラン）
            cureLadyPlans.basic.productInfo.selectedInsurancePaymentPeriod = self.selectedCureLadyInsurancePaymentPeriodBasic();

            // 選択された入院給付金日額（充実プラン）
            cureLadyPlans.rich.productInfo.selectedHospitalAmount = self.selectedCureLadyHospitalAmountRich();

            // 選択された先進医療特約（充実プラン）
            cureLadyPlans.rich.productInfo.selectedAdvancedMedical = self.selectedCureLadyAdvancedMedicalRich();

            // 選択されたがん診断治療給付金特約（充実プラン）
            cureLadyPlans.rich.productInfo.selectedCancerOption = self.selectedCureLadyCancerOptionRich();

            // 選択されたがん通院特約（充実プラン）
            cureLadyPlans.rich.productInfo.selectedCancerOutpatient = self.selectedCureLadyCancerOutpatientRich();

            // 選択された保険料払込期間の初期値（充実プラン）
            cureLadyPlans.rich.productInfo.selectedInsurancePaymentPeriod = self.selectedCureLadyInsurancePaymentPeriodRich();
        }
    }

    /**
     * ReliefWの商品固有情報設定
     * @method createReliefWProductInfo
     * @param reliefWPlans {Object} 商品データ構造のうちReliefWの部分
     */
    self.createReliefWProductInfo = function(reliefWPlans) {
        // 選択された入院給付金日額
        self.selectedReliefWHospitalAmount(reliefWPlans.standard.productInfo.selectedHospitalAmount);

        // 選択された先進医療特約
        self.selectedReliefWAdvancedMedical(reliefWPlans.standard.productInfo.selectedAdvancedMedical);

        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (reliefWPlans.standard.productInfo.insurancePaymentPeriod.length == 0) {
            var option = [{"text": "", "value": reliefWPlans.standard.productInfo.selectedInsurancePaymentPeriod}];
            // 保険料払込期間
            self.reliefWInsurancePaymentPeriod(option);
        } else {
            // 保険料払込期間
            self.reliefWInsurancePaymentPeriod(reliefWPlans.standard.productInfo.insurancePaymentPeriod);
        }

        // 選択された保険料払込期間の初期値
        self.selectedReliefWInsurancePaymentPeriod(reliefWPlans.standard.productInfo.selectedInsurancePaymentPeriod);
    }

    /**
     * ReliefWの商品固有情報をobservableに設定
     * @method setReliefWProductInfo
     * @param reliefWPlans {Object} 商品データ構造のうちReliefWの部分
     */
    self.setReliefWProductInfo = function(reliefWPlans) {
        // 選択された入院給付金日額
        reliefWPlans.standard.productInfo.selectedHospitalAmount = self.selectedReliefWHospitalAmount();

        // 選択された先進医療特約
        reliefWPlans.standard.productInfo.selectedAdvancedMedical = self.selectedReliefWAdvancedMedical();

        // 選択された保険料払込期間の初期値
        reliefWPlans.standard.productInfo.selectedInsurancePaymentPeriod = self.selectedReliefWInsurancePaymentPeriod();
    }

    /**
     * Believeの商品固有情報設定
     * @method createBelieveProductInfo
     * @param believePlans {Object} 商品データ構造のうちBelieveの部分
     */
    self.createBelieveProductInfo = function(believePlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された基本給付金額
            self.selectedBelieveAmount(believePlans.standard.productInfo.selectedAmount);

            // 選択されたがん先進医療特約
            self.selectedBelieveCancerAdvancedMedical(believePlans.standard.productInfo.selectedCancerAdvancedMedical);

            // 選択されたがん通院特約
            self.selectedBelieveCancerOutpatient(believePlans.standard.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (believePlans.standard.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": believePlans.standard.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間
                self.believeInsurancePaymentPeriod(option);
            } else {
                // 保険料払込期間
                self.believeInsurancePaymentPeriod(believePlans.standard.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値
            self.selectedBelieveInsurancePaymentPeriod(believePlans.standard.productInfo.selectedInsurancePaymentPeriod);
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (believePlans.basic.productInfo.amount.length == 0) {
                var option = [{"text": "", "value": believePlans.basic.productInfo.selectedAmount}];
                // 基本給付金額（充実プラン）
                self.believeAmountBasic(option);
            } else {
                // 基本給付金額（充実プラン）
                self.believeAmountBasic(believePlans.basic.productInfo.amount);
            }

            // 選択された基本給付金額（基本プラン）
            self.selectedBelieveAmountBasic(believePlans.basic.productInfo.selectedAmount);

            // 選択されたがん先進医療特約（基本プラン）
            self.selectedBelieveCancerAdvancedMedicalBasic(believePlans.basic.productInfo.selectedCancerAdvancedMedical);

            // 選択されたがん通院特約（基本プラン）
            self.selectedBelieveCancerOutpatientBasic(believePlans.basic.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (believePlans.basic.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": believePlans.basic.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（基本プラン）
                self.believeInsurancePaymentPeriodBasic(option);
            } else {
                // 保険料払込期間（基本プラン）
                self.believeInsurancePaymentPeriodBasic(believePlans.basic.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（基本プラン）
            self.selectedBelieveInsurancePaymentPeriodBasic(believePlans.basic.productInfo.selectedInsurancePaymentPeriod);


            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (believePlans.rich.productInfo.amount.length == 0) {
                var option = [{"text": "", "value": believePlans.rich.productInfo.selectedAmount}];
                // 基本給付金額（充実プラン）
                self.believeAmountRich(option);
            } else {
                // 基本給付金額（充実プラン）
                self.believeAmountRich(believePlans.rich.productInfo.amount);
            }

            // 選択された基本給付金額（充実プラン）
            self.selectedBelieveAmountRich(believePlans.rich.productInfo.selectedAmount);

            // 選択されたがん先進医療特約（充実プラン）
            self.selectedBelieveCancerAdvancedMedicalRich(believePlans.rich.productInfo.selectedCancerAdvancedMedical);

            // 選択されたがん通院特約（充実プラン）
            self.selectedBelieveCancerOutpatientRich(believePlans.rich.productInfo.selectedCancerOutpatient);

            // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
            if (believePlans.rich.productInfo.insurancePaymentPeriod.length == 0) {
                var option = [{"text": "", "value": believePlans.rich.productInfo.selectedInsurancePaymentPeriod}];
                // 保険料払込期間（充実プラン）
                self.believeInsurancePaymentPeriodRich(option);
            } else {
                // 保険料払込期間（充実プラン）
                self.believeInsurancePaymentPeriodRich(believePlans.rich.productInfo.insurancePaymentPeriod);
            }

            // 選択された保険料払込期間の初期値（充実プラン）
            self.selectedBelieveInsurancePaymentPeriodRich(believePlans.rich.productInfo.selectedInsurancePaymentPeriod);
        }
    }

    /**
     * Believeの商品固有情報をobservableに設定
     * @method setBelieveProductInfo
     * @param believePlans {Object} 商品データ構造のうちBelieveの部分
     */
    self.setBelieveProductInfo = function(believePlans) {
        // 全商品の場合
        if (self.isFreePlan()) {
            // 選択された基本給付金額
            believePlans.standard.productInfo.selectedAmount = self.selectedBelieveAmount();

            // 選択されたがん先進医療特約
            believePlans.standard.productInfo.selectedCancerAdvancedMedical = self.selectedBelieveCancerAdvancedMedical();

            // 選択されたがん通院特約
            believePlans.standard.productInfo.selectedCancerOutpatient = self.selectedBelieveCancerOutpatient();

            // 選択された保険料払込期間の初期値
            believePlans.standard.productInfo.selectedInsurancePaymentPeriod = self.selectedBelieveInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 選択された基本給付金額（基本プラン）
            believePlans.basic.productInfo.selectedAmount = self.selectedBelieveAmountBasic();

            // 選択されたがん先進医療特約（基本プラン）
            believePlans.basic.productInfo.selectedCancerAdvancedMedical = self.selectedBelieveCancerAdvancedMedicalBasic();

            // 選択されたがん通院特約（基本プラン）
            believePlans.basic.productInfo.selectedCancerOutpatient = self.selectedBelieveCancerOutpatientBasic();

            // 選択された保険料払込期間の初期値（基本プラン）
            believePlans.basic.productInfo.selectedInsurancePaymentPeriod = self.selectedBelieveInsurancePaymentPeriodBasic();

            // 選択された基本給付金額（充実プラン）
            believePlans.rich.productInfo.selectedAmount = self.selectedBelieveAmountRich();

            // 選択されたがん先進医療特約（充実プラン）
            believePlans.rich.productInfo.selectedCancerAdvancedMedical = self.selectedBelieveCancerAdvancedMedicalRich();

            // 選択されたがん通院特約（充実プラン）
            believePlans.rich.productInfo.selectedCancerOutpatient = self.selectedBelieveCancerOutpatientRich();

            // 選択された保険料払込期間の初期値（充実プラン）
            believePlans.rich.productInfo.selectedInsurancePaymentPeriod = self.selectedBelieveInsurancePaymentPeriodRich();
        }
    }

    /**
     * CureSupportの商品固有情報設定
     * @method createCureSupportProductInfo
     * @param cureSupportPlans {Object} 商品データ構造のうちCureSupportの部分
     */
    self.createCureSupportProductInfo = function(cureSupportPlans) {
        // 選択された入院給付金日額
        self.selectedCureSupportHospitalAmount(cureSupportPlans.standard.productInfo.selectedHospitalAmount);

        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (cureSupportPlans.standard.productInfo.relaxationLifetimeInsurance.length == 0) {
            var option = [{"text": "", "value": cureSupportPlans.standard.productInfo.selectedRelaxationLifetimeInsurance}];
            // 引受基準緩和型終身保険特約
            self.cureSupportRelaxationLifetimeInsurance(option);
        } else {
            // 引受基準緩和型終身保険特約
            self.cureSupportRelaxationLifetimeInsurance(cureSupportPlans.standard.productInfo.relaxationLifetimeInsurance);
        }

        // 選択された引受基準緩和型終身保険特約
        self.selectedCureSupportRelaxationLifetimeInsurance(cureSupportPlans.standard.productInfo.selectedRelaxationLifetimeInsurance);

        // 選択された引受基準緩和型先進医療特約
        self.selectedCureSupportRelaxationAdvancedMedical(cureSupportPlans.standard.productInfo.selectedRelaxationAdvancedMedical);
    }

    /**
     * CureSupportの商品固有情報をobservableに設定
     * @method setCureSupportProductInfo
     * @param cureSupportPlans {Object} 商品データ構造のうちCureSupportの部分
     */
    self.setCureSupportProductInfo = function(cureSupportPlans) {
        // 選択された入院給付金日額
        cureSupportPlans.standard.productInfo.selectedHospitalAmount = self.selectedCureSupportHospitalAmount();

        // 選択された引受基準緩和型終身保険特約
        cureSupportPlans.standard.productInfo.selectedRelaxationLifetimeInsurance = self.selectedCureSupportRelaxationLifetimeInsurance();

        // 選択された引受基準緩和型先進医療特約
        cureSupportPlans.standard.productInfo.selectedRelaxationAdvancedMedical = self.selectedCureSupportRelaxationAdvancedMedical();
    }

    /**
     * RiseSupportの商品固有情報設定
     * @method createRiseSupportProductInfo
     * @param riseSupportPlans {Object} 商品データ構造のうちRiseSupportの部分
     */
    self.createRiseSupportProductInfo = function(riseSupportPlans) {
        // 年齢変更などで、プルダウンの中身が空配列になる場合、選択していた値を生成してプルダウンに詰める（空配列のままだと、bindの影響で選択値がundefinedになるため）
        if (riseSupportPlans.standard.productInfo.insuranceAmount.length == 0) {
            var option = [{"text": "", "value": riseSupportPlans.standard.productInfo.selectedInsuranceAmount}];
            // 保険金額
            self.riseSupportInsuranceAmount(option);
        } else {
            // 保険金額
            self.riseSupportInsuranceAmount(riseSupportPlans.standard.productInfo.insuranceAmount);
        }

        // 選択された保険金額
        self.selectedRiseSupportInsuranceAmount(riseSupportPlans.standard.productInfo.selectedInsuranceAmount);
    }

    /**
     * RiseSupportの商品固有情報をobservableに設定
     * @method setRiseSupportProductInfo
     * @param riseSupportPlans {Object} 商品データ構造のうちRiseSupportの部分
     */
    self.setRiseSupportProductInfo = function(riseSupportPlans) {
        // 選択された保険金額
        riseSupportPlans.standard.productInfo.selectedInsuranceAmount = self.selectedRiseSupportInsuranceAmount();
    }

    /**
     * 生年月日・性別選択ダイアログの表示
     * @method showSettingProfileDialog
     */
    self.showSettingProfileDialog = function() {
        if (!$(this).find('a').hasClass('disable')) {
            $(".bk_bg").css("display", "block");
            $("#age-setting").fadeIn(500);
        }
    }

    /**
     * 生年月日・性別選択ダイアログでスタートボタンを押下
     * @method clockStartButton
     */
    self.clickStartButton = function() {
        //生年月日が選択されていなかったら押下不可
        if (self.selectedBirthdayYear() == '' || self.selectedBirthdayMonth() == '' || self.selectedBirthdayDay() == ''){
             return false;
        }
        // 初回シミュレーションの場合
        if (self.firstSimulation()) {
            // 保険の選択状態を一時保存をするため、コピー
            tempProducts = $.extend(true, {}, self.plan());
            // 保険の選択状態を一時保存して初期化、選択可否フラグをセット
            ko.utils.arrayForEach(tempProducts.products, function(product){
                self.tempSelectState(product);
            });      

            // genderctl=1、かつ、男性の場合はCureを選択
            if (self.genderCtl() == '1' && self.selectedGender() == '1') {
                tempIsSelectedCure = true;
                tempIsSelectedCureLady = false;
            // genderctl=1、かつ、女性の場合はCureLadyを選択
            } else if (self.genderCtl() == '1' && self.selectedGender() == '2') {
                tempIsSelectedCure = false;
                tempIsSelectedCureLady = true;
            }
        } else {
            tempProducts = [];
        }

        // 性別によりキュアレディの選択可否を変更する
        if (self.selectedGender() == '1'){
            tempIsSelectedCureLady = false;
            self.selectableCureLady(false);
            self.cureLadyDisableMessage('新キュア・レディは<br>女性専用の保険となります。');
        } else {
            self.selectableCureLady(true);
        }

        // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
        self.setCureSupportRelaxationLifetimeInsurance();

        // 契約年齢、保険料計算
        self.calcAge();

        // 印刷用の改ページ追加
        self.addPrintPageBreak();

        // ダイアログを閉じる
        $(".bk_bg").css("display", "none");
        $("#age-setting").fadeOut(500);
    }

    /**
     * 選択している商品のうち、一番先頭の場所にスクロール
     * @method scrollToActiveProduct
     */
    self.scrollToActiveProduct = function() {
        if ((self.index() == '1' || self.index() == '3') && $('.itembox.active').size() && !self.isSelectedBridge()){
            var p = $('.itembox.active').eq(0).offset().top - 20;
            $('html,body').animate({ scrollTop: p },2000);
        }
    }

    /**
     * ブリッジ選択
     * @method toggleDetail
     * @param  data {Object} [description]
     * @param  event {Object} [description]
     */
    self.toggleDetail = function(data, event){

        // closeクラスがどのイベントで追加されるか不明
        // if ($("#bridge.close").size()) {
        //  return
        // }

        // クリック元の要素から商品名を特定
        var product = $(event.target).closest('.itembox').attr('id');

        // 選択できない状態のときは即リターン
        if ($("#" + product).hasClass("close")) {
            return;
        }

        self.validation();
    };

    /**
     * subscribeから呼び出し用のバリデーション
     * @method validationForSubscribe
     * @param id {string}
     */
    self.validationForSubscribe = function(id) {
        var data = {
            target: {
                id : id
            }
        };

        self.validation(null, data);
    };

    /**
     * バリデーション
     * @method validation
     * @param  event {Object}
     * @param  data {Object}
     */
    self.validation = function(event, data) {

        // プルダウンに入れたdata-bindのevent: {change}は、画面初期化時にも行われるため、初回はバリデーションかけずにreturn
        if ( (!self.isSelectedBridge() && data.target.id == 'bridge_sum_insured') || (!self.isSelectedBridge() && data.target.id == 'bridge_term') ||
             (!self.isSelectedFineSave() && data.target.id == 'fs_sum_insured') || (!self.isSelectedFineSave() && data.target.id == 'fs_term') ||
             (!self.isSelectedKeep() && data.target.id == 'keep_period') || (!self.isSelectedCure() && data.target.id == 'cure_period') ||
             (!self.isSelectedCureLady() && data.target.id == 'cure-l_period') || (!self.isSelectedReliefW() && data.target.id == 'relief-w_period') ||
             (!self.isSelectedBelieve() && data.target.id == 'believe_period') || (!self.isSelectedCureSupport() && data.target.id == 'cure-s_sum_insured') ||
             (!self.isSelectedRiseSupport() && data.target.id == 'rise_sum_insured') || (!self.isSelectedBridge() && data.target.id == 'bridge_sum_insured_1') ||
             (!self.isSelectedBridge() && data.target.id == 'bridge_sum_insured_2') || (!self.isSelectedBridge() && data.target.id == 'bridge_term_1') ||
             (!self.isSelectedBridge() && data.target.id == 'bridge_term_2') || (!self.isSelectedCure() && data.target.id == 'cure_benefit_1') ||
             (!self.isSelectedCure() && data.target.id == 'cure_benefit_2') || (!self.isSelectedCure() && data.target.id == 'cure_period_1') ||
             (!self.isSelectedCure() && data.target.id == 'cure_period_2') || (!self.isSelectedCureLady() && data.target.id == 'cure-l_benefit_1') ||
             (!self.isSelectedCureLady() && data.target.id == 'cure-l_benefit_2') || (!self.isSelectedCureLady() && data.target.id == 'cure-l_period_1') ||
             (!self.isSelectedCureLady() && data.target.id == 'cure-l_period_2') || (!self.isSelectedBelieve() && data.target.id == 'believe_benefit_1') ||
             (!self.isSelectedBelieve() && data.target.id == 'believe_benefit_2') || (!self.isSelectedBelieve() && data.target.id == 'believe_period_1') ||
             (!self.isSelectedBelieve() && data.target.id == 'believe_period_2') ) {
            return;
        }


        // 先進医療特約変更の制御をかける
        self.controlAdvancedMedicine(data);

        // おすすめ商品の場合
        if (self.isSelectPlan()) {
            switch (data.target.id) {
                case 'tab01':
                case 'tab01_midtxt':
                    // 基本プランを選択
                    self.selectedPlan('basic');

                    // プラン選択では、保険料計算をしないためreturn
                    return;
                    break;
                case 'tab02':
                case 'tab02_midtxt':
                    // 充実プランを選択
                    self.selectedPlan('rich');

                    // プラン選択では、保険料計算をしないためreturn
                    return;
                    break;
                default:
                    break;
            }
        }

        // 商品固有情報を画面に設定
        self.setProductInfo();

        switch (data.target.id) {
            case 'cure_check':
            case 'relief-w_check':
                // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
                self.setCureSupportRelaxationLifetimeInsurance();
                // 選択商品の組み合わせで商品を活性化・非活性化
                self.selectItem();
                // 先進医療特約設定
                self.advancedMedicine();
                // 印刷用の改ページ追加
                self.addPrintPageBreak();
                break;            
            case 'cure-l_check':
            case 'believe_check':
            case 'cure-s_check':
                // 給付金額のdisable制御をかける
                self.controlAmount();                
                // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
                self.setCureSupportRelaxationLifetimeInsurance();
                // 選択商品の組み合わせで商品を活性化・非活性化
                self.selectItem();
                // 先進医療特約設定
                self.advancedMedicine();
                // 印刷用の改ページ追加
                self.addPrintPageBreak();
                break;
            case 'bridge_check':
            case 'fs_check':
            case 'keep_check':
            case 'rise_check':
                // CureSupportの引受基準緩和型終身保険特約のプルダウンを変更
                self.setCureSupportRelaxationLifetimeInsurance();
                // 選択商品の組み合わせで商品を活性化・非活性化
                self.selectItem();
                // 印刷用の改ページ追加
                self.addPrintPageBreak();
                break;
            case 'bridge_sum_insured':
            case 'bridge_sum_insured_1':
            case 'bridge_sum_insured_2':
            case 'bridge_term':
            case 'bridge_term_1':
            case 'bridge_term_2':
                // Bridgeの保険料計算
                self.createBridgePay(false);
                break;
            case 'fs_sum_insured':
            case 'fs_term':
                // Finesaveの保険料計算
                self.createFinesavePay(false);
                break;
            case 'keep_benefit_1':
            case 'keep_benefit_2':
            case 'keep_benefit_3':
            case 'keep_term_1':
            case 'keep_term_2':
            case 'keep_period':
                // Keepの保険料計算
                self.createKeepPay(false);
                break;
            case 'cure_benefit_1':
            case 'cure_benefit_2':
            case 'cure_advanced_medicine_1':
            case 'cure_advanced_medicine_2':
            case 'cure_advanced_medicine_11':
            case 'cure_advanced_medicine_12':
            case 'cure_advanced_medicine_21':
            case 'cure_advanced_medicine_22':
            case 'cure_cancerpremium_period_1':
            case 'cure_cancerpremium_period_2':
            case 'cure_cancerpremium_period_11':
            case 'cure_cancerpremium_period_12':
            case 'cure_cancerpremium_period_21':
            case 'cure_cancerpremium_period_22':
            case 'cure_cancer_period_1':
            case 'cure_cancer_period_2':
            case 'cure_cancer_period_11':
            case 'cure_cancer_period_12':
            case 'cure_cancer_period_21':
            case 'cure_cancer_period_22':
            case 'cure_period':
            case 'cure_period_1':
            case 'cure_period_2':
                // Cureの保険料計算
                self.createCurePay(false, data);
                break;
            case 'cure_cancerpremium_period_2':
            case 'cure_cancerpremium_period_12':
                // 選択されたCureがん診断治療給付金特約が「付加しない」をチェックされた場合、選択されたCureがん通院特約を「付加しない」にチェック
                self.selectedCureCancerOutpatient('0');
                // Cureの保険料計算
                self.createCurePay(false);
                break;
            case 'cure-l_benefit_1':
            case 'cure-l_benefit_2':
            case 'cure-l_advanced_medicine_1':
            case 'cure-l_advanced_medicine_2':
            case 'cure-l_advanced_medicine_11':
            case 'cure-l_advanced_medicine_12':
            case 'cure-l_advanced_medicine_21':
            case 'cure-l_advanced_medicine_22':
            case 'cure-l_cancerpremium_period_1':
            case 'cure-l_cancerpremium_period_2':
            case 'cure-l_cancerpremium_period_11':
            case 'cure-l_cancerpremium_period_21':
            case 'cure-l_cancerpremium_period_22':
            case 'cure-l_cancer_period_1':
            case 'cure-l_cancer_period_2':
            case 'cure-l_cancer_period_11':
            case 'cure-l_cancer_period_12':
            case 'cure-l_cancer_period_21':
            case 'cure-l_cancer_period_22':
            case 'cure-l_period':
            case 'cure-l_period_1':
            case 'cure-l_period_2':
                // CureLadyの保険料計算
                self.createCureLadyPay(false);
                break;
            case 'cure-l_cancerpremium_period_2':
            case 'cure-l_cancerpremium_period_12':
                // 選択されたCureLadyがん診断治療給付金特約が「付加しない」をチェックされた場合、選択されたCureLadyがん通院特約を「付加しない」にチェック
                self.selectedCureLadyCancerOutpatient('0');
                // CureLadyの保険料計算
                self.createCureLadyPay(false);
                break;
            case 'relief-w_benefit_1':
            case 'relief-w_benefit_2':
            case 'relief-w_benefit_3':
            case 'relief-w_advanced_medicine_1':
            case 'relief-w_advanced_medicine_2':
            case 'relief-w_period':
                // ReiefWの保険料計算
                self.createReliefWPay(false);
                break;
            case 'believe_benefit_1':
            case 'believe_benefit_2':
            case 'believe_premium_pay_period_1':
            case 'believe_premium_pay_period_2':
            case 'believe_premium_pay_period_11':
            case 'believe_premium_pay_period_12':
            case 'believe_premium_pay_period_21':
            case 'believe_premium_pay_period_22':
            case 'believe_cancerhospvisit_period_1':
            case 'believe_cancerhospvisit_period_2':
            case 'believe_cancerhospvisit_period_11':
            case 'believe_cancerhospvisit_period_12':
            case 'believe_cancerhospvisit_period_21':
            case 'believe_cancerhospvisit_period_22':
            case 'believe_period':
            case 'believe_period_1':
            case 'believe_period_2':
                // Believeの保険料計算
                self.createBelievePay(false);
                break;
            case 'cure-s_benefit_1':
            case 'cure-s_benefit_2':
            case 'cure-s_benefit_3':
            case 'cure-s_advanced_medicine_1':
            case 'cure-s_advanced_medicine_2':
                // CureSupportの保険料計算
                self.createCureSupportPay(false);
                break;
            case 'cure-s_sum_insured':
                 // 選択商品の組み合わせで商品を活性化・非活性化
                self.selectItem();
                // CureSupportの保険料計算
                self.createCureSupportPay(false);
                break;
            case 'rise_sum_insured':
                // RiseSupportの保険料計算
                self.createRiseSupportPay(false);
                break;
            default:
                break;
        }

        // 保険料の合計を計算
        self.sum();

        // koのclickバインドに指定されるメソッドはtrueを返す必要がある(trueを返さないとcheckやdisableがうまく動かない)
        return true;
    }

    /**
     * 選択商品の組み合わせで商品を活性化・非活性化
     * @method selectItem
     */
    self.selectItem = function() {
        // indexが2の時はすぐリターン
        if (self.index() == '2') {
            // Cure、CureLady、ReliefWの複数同時申込の文言表示
            self.threeItem();
            return;
        }

        // ブリッジかキュアサポート(終身特約付)が選択されたときはキープを選択できない
        if (self.isSelectedBridge() || self.isSelectedCureSupportWithLifetimeInsurance()) {
            self.selectableKeep(false);
            self.isSelectedKeep(false);
            // 契約年齢や選択状態によって、文言を出しわける
            if ( (self.selectedGender() == '1' && !(23 <= self.contractAge() && self.contractAge() <= 55)) ||
                 (self.selectedGender() == '2' && !(23 <= self.contractAge() && self.contractAge() <= 46)) ) {
                self.keepDisableMessage('この商品は<br>お申込みできません。');
            } else if (self.isSelectedBridge()) {
                self.keepDisableMessage('ブリッジと同時に<br>お申込みできません。');
            } else if (self.isSelectedCureSupportWithLifetimeInsurance()) {
                self.keepDisableMessage('キュアサポート（終身特約付）と<br>同時にお申込みできません。'); 
            }           
        } else {
            // 男性で23歳～56歳の場合
            if (self.selectedGender() == '1' && 23 <= self.contractAge() && self.contractAge() <= 55) {
                self.selectableKeep(true);
            // 女性で23歳～46歳の場合
            } else if (self.selectedGender() == '2' && 23 <= self.contractAge() && self.contractAge() <= 46) {
                self.selectableKeep(true);
            // それ以外は、キープを選択できない
            } else {
                self.selectableKeep(false);
                self.isSelectedKeep(false);
                self.keepDisableMessage('この商品は<br>お申込みできません。');
            }
        }

        // キープかキュアサポート(終身特約付)が選択されたときはブリッジを選択できない
        if (self.isSelectedKeep() || self.isSelectedCureSupportWithLifetimeInsurance()) {
            self.selectableBridge(false);
            self.isSelectedBridge(false);
            // 契約年齢や選択状態によって、文言を出しわける
            if ( !(20 <= self.contractAge() && self.contractAge() <= 65) ) {
                self.selectableBridge(false);
                self.isSelectedBridge(false);
                self.bridgeDisableMessage('この商品は<br>お申込みできません。');
            } else if (self.isSelectedKeep()) {
                self.bridgeDisableMessage('キープと同時に<br>お申込みできません。');
            } else if (self.isSelectedCureSupportWithLifetimeInsurance()) {
                self.bridgeDisableMessage('キュアサポート（終身特約付）と<br>同時にお申込みできません。');
            }
        } else {
            // 20歳～65歳以外の場合は、ブリッジを選択できない
            if (20 <= self.contractAge() && self.contractAge() <= 65) {
                self.selectableBridge(true);
            } else {
                self.selectableBridge(false);
                self.isSelectedBridge(false);
                self.bridgeDisableMessage('この商品は<br>お申込みできません。');
            }            
        }

        // キュアとキュアレディが選択されていたらリリーフは選択できない
        if (self.isSelectedCure() && self.isSelectedCureLady()) {
            self.selectableReliefW(false);
            self.isSelectedReliefW(false);
            // 契約年齢によって文言を出しわける
            if (15 <= self.contractAge() && self.contractAge() <= 65) {
                self.reliefWDisableMessage('新キュア、新キュアレディと<br>3つ同時にお申込みできません。');                
            } else {
                self.reliefWDisableMessage('この商品は<br>お申込みできません。'); 
            }
        } else {
            // 15歳～65歳以外の場合は、リリーフは選択できない
            if (15 <= self.contractAge() && self.contractAge() <= 65) {
                self.selectableReliefW(true);
            } else {
                self.selectableReliefW(false);
                self.isSelectedReliefW(false);
                self.reliefWDisableMessage('この商品は<br>お申込みできません。');                
            }
        }

        // キュアレディの活性制御は女性の時のみ行う
        if (self.selectedGender() == '2') {
            // キュアとリリーフが選択または、キュアサポート(終身特約付)とリリーフが選択されていないときはキュアレディを選択できない
            if ((self.isSelectedCure() && self.isSelectedReliefW()) || (self.isSelectedCureSupportWithLifetimeInsurance() && !self.isSelectedReliefW())) {
                self.selectableCureLady(false);
                self.isSelectedCureLady(false);
                // 契約年齢や選択状態によって、文言を出しわける
                if ( !(16 <= self.contractAge() && self.contractAge() <= 75) ) {
                    self.cureLadyDisableMessage('この商品は<br>お申込みできません。');
                } else if (self.isSelectedCure() && self.isSelectedReliefW()) {
                    self.cureLadyDisableMessage('新キュア、リリーフダブルと<br>3つ同時にお申込みできません。');
                } else if(self.isSelectedCureSupportWithLifetimeInsurance() && !self.isSelectedReliefW()) {
                    self.cureLadyDisableMessage('キュアサポート（終身特約付）と<br>同時にお申込みできません。');
                }
            } else {
                // 16～75歳以外の場合は、キュアレディを選択できない
                if (16 <= self.contractAge() && self.contractAge() <= 75) {
                    self.selectableCureLady(true);
                } else {
                    self.selectableCureLady(false);
                    self.isSelectedCureLady(false);
                    self.cureLadyDisableMessage('この商品は<br>お申込みできません。');
                }                
            }
        }

        // キュアレディとリリーフが選択または、キュアサポート(終身特約付)とリリーフが選択されていない時はキュアを選択できない
        if ((self.isSelectedCureLady() && self.isSelectedReliefW()) || (self.isSelectedCureSupportWithLifetimeInsurance() && !self.isSelectedReliefW())) {
            self.selectableCure(false);
            self.isSelectedCure(false);
            if (76 <= self.contractAge()) {
                self.cureDisableMessage('この商品は<br>お申込みできません。');
            } else if (self.isSelectedCureLady() && self.isSelectedReliefW()) {
                self.cureDisableMessage('新キュアレディ、リリーフダブル<br>と3つ同時にお申込みできません。');
            } else if (self.isSelectedCureSupportWithLifetimeInsurance() && !self.isSelectedReliefW()) {
                self.cureDisableMessage('キュアサポート（終身特約付）と<br>同時にお申込みできません。');
            }
        } else {
            // 76歳～の場合は、キュアを選択できない
            if (76 <= self.contractAge()) {
                self.selectableCure(false);
                self.isSelectedCure(false);
                self.cureDisableMessage('この商品は<br>お申込みできません。');
            } else {
                self.selectableCure(true);
            }
        }

        // Cure、CureLady、ReliefWの複数同時申込の文言表示
        self.threeItem();
    }

    /**
     * Bridgeの保険料計算
     * @method createBridgePay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createBridgePay = function(force){
        // Bridgeを選択していない場合は計算しない
        if (!force && !self.isSelectedBridge()) {
            return;
        }
        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && bridgeVals[0][0] == self.selectedBridgeInsuranceAmount() && bridgeVals[0][1] == self.selectedBridgeInsurancePeriod()) {
                return;
            }
            // 現在の値を設定
            bridgeVals[0][0] = self.selectedBridgeInsuranceAmount();
            bridgeVals[0][1] = self.selectedBridgeInsurancePeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 強制的に計算する場合は、基本プランも充実プランも計算
            if (force) {
                // 現在の値を設定
                bridgeVals[1][0] = self.selectedBridgeInsuranceAmountBasic();
                bridgeVals[1][1] = self.selectedBridgeInsurancePeriodBasic();
                bridgeVals[2][0] = self.selectedBridgeInsuranceAmountRich();
                bridgeVals[2][1] = self.selectedBridgeInsurancePeriodRich();
            } else if (!force && self.isSelectPlanBasic()) {
                // 基本プランで、前回と同じ値であれば保険料計算しない
                if (!force && self.isSelectPlanBasic() && bridgeVals[1][0] == self.selectedBridgeInsuranceAmountBasic() &&
                    bridgeVals[1][1] == self.selectedBridgeInsurancePeriodBasic()) {
                    return;
                }
                // 現在の値を設定
                bridgeVals[1][0] = self.selectedBridgeInsuranceAmountBasic();
                bridgeVals[1][1] = self.selectedBridgeInsurancePeriodBasic();
            } else if　(!force && self.isSelectPlanRich()) {
                // 充実プランで、前回と同じ値であれば保険料計算しない
                if (!force && bridgeVals[2][0] == self.selectedBridgeInsuranceAmountRich() &&
                    bridgeVals[2][1] == self.selectedBridgeInsurancePeriodRich()) {
                    return;
                }
                // 現在の値を設定
                bridgeVals[2][0] = self.selectedBridgeInsuranceAmountRich();
                bridgeVals[2][1] = self.selectedBridgeInsurancePeriodRich();
            }
        }
        // シミュレーション実行
        self.executeSimulation("3G", force);
    }

    /**
     * Finsaveの保険料計算
     * @method createFinesavePay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createFinesavePay = function(force){
        // Finesaveを選択していない場合は計算しない
        if (!force && !self.isSelectedFineSave()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && FinesaveVals[0][0] == self.selectedFineSaveInsuranceAmount() && FinesaveVals[0][1] == self.selectedFineSaveInsurancePeriod()) {
                return;
            }
            // 現在の値を設定
            FinesaveVals[0][0] = self.selectedFineSaveInsuranceAmount();
            FinesaveVals[0][1] = self.selectedFineSaveInsurancePeriod();
        }
        // シミュレーション実行
        self.executeSimulation("37", force);
    }

    /**
     * Keepの保険料計算
     * @method createKeepPay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createKeepPay = function(force){
        // Keepを選択していない場合は計算しない
        if (!force && !self.isSelectedKeep()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && keepVals[0][0] == self.selectedKeepMonthlyPension() && keepVals[0][1] == self.selectedKeepPaymentGuaranteePeriod() &&
                keepVals[0][2] == self.selectedKeepInsurancePeriod()) {
                return;
            }
            // 現在の値を設定
            keepVals[0][0] = self.selectedKeepMonthlyPension();
            keepVals[0][1] = self.selectedKeepPaymentGuaranteePeriod();
            keepVals[0][2] = self.selectedKeepInsurancePeriod();
        }
        // シミュレーション実行
        self.executeSimulation("3F", force);
    }

    /**
     * Cureの保険料計算
     * @method createCurePay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createCurePay = function(force, data){
        // Cureを選択していない場合は計算しない
        if (!force && !self.isSelectedCure()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && cureVals[0][0] == self.selectedCureHospitalAmount() && cureVals[0][1] == self.selectedCureAdvancedMedical() &&
                cureVals[0][2] == self.selectedCureCancerOption() && cureVals[0][3] == self.selectedCureCancerOutpatient() &&
                cureVals[0][4] == self.selectedCureInsurancePaymentPeriod()) {
                return;
            }
            // 現在の値を設定
            cureVals[0][0] = self.selectedCureHospitalAmount();
            cureVals[0][1] = self.selectedCureAdvancedMedical();
            cureVals[0][2] = self.selectedCureCancerOption();
            cureVals[0][3] = self.selectedCureCancerOutpatient();
            cureVals[0][4] = self.selectedCureInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (
                (!force && cureVals[1][0] == self.selectedCureHospitalAmountBasic() && cureVals[1][1] == self.selectedCureAdvancedMedicalBasic() &&
                    cureVals[1][2] == self.selectedCureCancerOptionBasic() && cureVals[1][3] == self.selectedCureCancerOutpatientBasic() &&
                    cureVals[1][4] == self.selectedCureInsurancePaymentPeriodBasic()
                ) && 
                (!force && cureVals[2][0] == self.selectedCureHospitalAmountRich() && cureVals[2][1] == self.selectedCureAdvancedMedicalRich() &&
                    cureVals[2][2] == self.selectedCureCancerOptionRich() && cureVals[2][3] == self.selectedCureCancerOutpatientRich() &&
                    cureVals[2][4] == self.selectedCureInsurancePaymentPeriodRich()
                )
               ) {
                return;
            }

            // 現在の値を設定
            cureVals[1][0] = self.selectedCureHospitalAmountBasic();
            cureVals[1][1] = self.selectedCureAdvancedMedicalBasic();
            cureVals[1][2] = self.selectedCureCancerOptionBasic();
            cureVals[1][3] = self.selectedCureCancerOutpatientBasic();
            cureVals[1][4] = self.selectedCureInsurancePaymentPeriodBasic();
            // 現在の値を設定
            cureVals[2][0] = self.selectedCureHospitalAmountRich();
            cureVals[2][1] = self.selectedCureAdvancedMedicalRich();
            cureVals[2][2] = self.selectedCureCancerOptionRich();
            cureVals[2][3] = self.selectedCureCancerOutpatientRich();
            cureVals[2][4] = self.selectedCureInsurancePaymentPeriodRich();
        }
        // シミュレーション実行
        self.executeSimulation("4C", force);
    }

    /**
     * CureLadyの保険料計算
     * @method createCureLadyPay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createCureLadyPay = function(force){
        // CureLadyを選択していない場合は計算しない
        if (!force && !self.isSelectedCureLady()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && cureLadyVals[0][0] == self.selectedCureLadyHospitalAmount() && cureLadyVals[0][1] == self.selectedCureLadyAdvancedMedical() &&
                cureLadyVals[0][2] == self.selectedCureLadyCancerOption() && cureLadyVals[0][3] == self.selectedCureLadyCancerOutpatient() &&
                cureLadyVals[0][4] == self.selectedCureLadyInsurancePaymentPeriod()) {
                return;
            }
            // 現在の値を設定
            cureLadyVals[0][0] = self.selectedCureLadyHospitalAmount();
            cureLadyVals[0][1] = self.selectedCureLadyAdvancedMedical();
            cureLadyVals[0][2] = self.selectedCureLadyCancerOption();
            cureLadyVals[0][3] = self.selectedCureLadyCancerOutpatient();
            cureLadyVals[0][4] = self.selectedCureLadyInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (
                (!force && cureLadyVals[1][0] == self.selectedCureLadyHospitalAmountBasic() && cureLadyVals[1][1] == self.selectedCureLadyAdvancedMedicalBasic() &&
                    cureLadyVals[1][2] == self.selectedCureLadyCancerOptionBasic() && cureLadyVals[1][3] == self.selectedCureLadyCancerOutpatientBasic() &&
                    cureLadyVals[1][4] == self.selectedCureLadyInsurancePaymentPeriodBasic()
                ) && 
                (!force && cureLadyVals[2][0] == self.selectedCureLadyHospitalAmountRich() && cureLadyVals[2][1] == self.selectedCureLadyAdvancedMedicalRich() &&
                    cureLadyVals[2][2] == self.selectedCureLadyCancerOptionRich() && cureLadyVals[2][3] == self.selectedCureLadyCancerOutpatientRich() &&
                    cureLadyVals[2][4] == self.selectedCureLadyInsurancePaymentPeriodRich()
                )
               ) {
                return;
            }
            // 現在の値を設定
            cureLadyVals[1][0] = self.selectedCureLadyHospitalAmountBasic();
            cureLadyVals[1][1] = self.selectedCureLadyAdvancedMedicalBasic();
            cureLadyVals[1][2] = self.selectedCureLadyCancerOptionBasic();
            cureLadyVals[1][3] = self.selectedCureLadyCancerOutpatientBasic();
            cureLadyVals[1][4] = self.selectedCureLadyInsurancePaymentPeriodBasic();
            cureLadyVals[2][0] = self.selectedCureLadyHospitalAmountRich();
            cureLadyVals[2][1] = self.selectedCureLadyAdvancedMedicalRich();
            cureLadyVals[2][2] = self.selectedCureLadyCancerOptionRich();
            cureLadyVals[2][3] = self.selectedCureLadyCancerOutpatientRich();
            cureLadyVals[2][4] = self.selectedCureLadyInsurancePaymentPeriodRich();
        }
        // シミュレーション実行
        self.executeSimulation("4A", force);
    }

    /**
     * ReliefWの保険料計算
     * @method createReliefWPay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createReliefWPay = function(force){
        // ReliefWを選択していない場合は計算しない
        if (!force && !self.isSelectedReliefW()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && reliefWVals[0][0] == self.selectedReliefWHospitalAmount() && reliefWVals[0][1] == self.selectedReliefWAdvancedMedical() &&
                reliefWVals[0][2] == self.selectedReliefWInsurancePaymentPeriod()) {
                return;
            }
            // 現在の値を設定
            reliefWVals[0][0] = self.selectedReliefWHospitalAmount();
            reliefWVals[0][1] = self.selectedReliefWAdvancedMedical();
            reliefWVals[0][2] = self.selectedReliefWInsurancePaymentPeriod();
        }
        // シミュレーション実行
        self.executeSimulation("1P", force);
    }

    /**
     * Believeの保険料計算
     * @method createBelievePay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createBelievePay = function(force){
        // Believeを選択していない場合は計算しない
        if (!force && !self.isSelectedBelieve()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && believeVals[0][0] == self.selectedBelieveAmount() && believeVals[0][1] == self.selectedBelieveCancerAdvancedMedical() &&
                believeVals[0][2] == self.selectedBelieveCancerOutpatient() && believeVals[0][3] == self.selectedBelieveInsurancePaymentPeriod()) {
                return;
            }
            // 現在の値を設定
            believeVals[0][0] = self.selectedBelieveAmount();
            believeVals[0][1] = self.selectedBelieveCancerAdvancedMedical();
            believeVals[0][2] = self.selectedBelieveCancerOutpatient();
            believeVals[0][3] = self.selectedBelieveInsurancePaymentPeriod();
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // 基本プランで、前回と同じ値であれば保険料計算しない
            if (
                (!force && believeVals[1][0] == self.selectedBelieveAmountBasic() && believeVals[1][1] == self.selectedBelieveCancerAdvancedMedicalBasic() &&
                    believeVals[1][2] == self.selectedBelieveCancerOutpatientBasic() && believeVals[1][3] == self.selectedBelieveInsurancePaymentPeriodBasic()
                ) && 
                (!force && believeVals[2][0] == self.selectedBelieveAmountRich() && believeVals[2][1] == self.selectedBelieveCancerAdvancedMedicalRich() &&
                    believeVals[2][2] == self.selectedBelieveCancerOutpatientRich() && believeVals[2][3] == self.selectedBelieveInsurancePaymentPeriodRich()
                )
               ){
                return;
            }
            // 現在の値を設定
            believeVals[1][0] = self.selectedBelieveAmountBasic();
            believeVals[1][1] = self.selectedBelieveCancerAdvancedMedicalBasic();
            believeVals[1][2] = self.selectedBelieveCancerOutpatientBasic();
            believeVals[1][3] = self.selectedBelieveInsurancePaymentPeriodBasic();
            believeVals[2][0] = self.selectedBelieveAmountRich();
            believeVals[2][1] = self.selectedBelieveCancerAdvancedMedicalRich();
            believeVals[2][2] = self.selectedBelieveCancerOutpatientRich();
            believeVals[2][3] = self.selectedBelieveInsurancePaymentPeriodRich();
        }
        // シミュレーション実行
        self.executeSimulation("1V", force);
    }

    /**
     * CureSupportの保険料計算
     * @method createCureSupportPay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createCureSupportPay = function(force){
        // CureSupportを選択していない場合は計算しない
        if (!force && !self.isSelectedCureSupport()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && cureSupportVals[0][0] == self.selectedCureSupportHospitalAmount() && cureSupportVals[0][1] == self.selectedCureSupportRelaxationLifetimeInsurance() &&
                cureSupportVals[0][2] == self.selectedCureSupportRelaxationAdvancedMedical()) {
                return;
            }
            // 現在の値を設定
            cureSupportVals[0][0] = self.selectedCureSupportHospitalAmount();
            cureSupportVals[0][1] = self.selectedCureSupportRelaxationLifetimeInsurance();
            cureSupportVals[0][2] = self.selectedCureSupportRelaxationAdvancedMedical();
        }
        // シミュレーション実行
        self.executeSimulation("1W", force);
    }

    /**
     * riseSupportの保険料計算
     * @method createRiseSupportPay
     * @param force {boolean} true: 強制的に計算する, false: 商品選択していないと計算しない
     */
    self.createRiseSupportPay = function(force){
        // riseSupportを選択していない場合は計算しない
        if (!force && !self.isSelectedRiseSupport()) {
            return;
        }

        // 全商品の場合
        if (self.isFreePlan()) {
            // 前回と同じ値であれば保険料計算しない
            if (!force && riseSupportVals[0][0] == self.selectedRiseSupportInsuranceAmount()) {
                return;
            }
            // 現在の値を設定
            riseSupportVals[0][0] = self.selectedRiseSupportInsuranceAmount();
        }
        // シミュレーション実行
        self.executeSimulation("1Y", force);
    }

    /**
     * 契約年齢を取得する
     * @method calcAge
     */
    self.calcAge = function(){
        // 商品欄全体のブロック
        $('#products-wrapper').block();
                
        // 契約年齢計算中はロード表示
        $('#user-status').block({
            message: '<img src="/mypage/images/sim/loading.gif" alt="" width="24" height="24">',
            css: {
                width: '24px',
                height: '24px',
                border: '1px'
            },
            overlayCSS:  {
                backgroundColor: '#FFFFFF',
                opacity: 0.6
            }
        });

        var apiUrl = "/mypage/api/simulation-calc-age";

        // ポストデータ作成
        self.plan().applyInfo.birthdayYear = self.selectedBirthdayYear();
        self.plan().applyInfo.birthdayMonth = self.selectedBirthdayMonth();
        self.plan().applyInfo.birthdayDay = self.selectedBirthdayDay();
        self.plan().applyInfo.gender = self.selectedGender();
        // 保険料払い込み方法　シミュレーションは必ずクレジットカード
        self.plan().applyInfo.paymentType = '0';

        var postData = {
            'status': 'OK',
            '_token': 'testToken',
            'position': 'simulation',
            'content': { applyInfo: self.plan().applyInfo }
        };

        console.log('%ccalcAgeへのpostData:', app.apiRequeStyleStyle, postData);

        // シミュレーションAPI呼び出し
        app.ajax(apiUrl, postData, false)
        .done(function (result, textStatus, jqXHR) {
            // console.log("AJax Status: " + jqXHR.status + ", " + textStatus); // for debug
            console.log('%ccalcAge結果:', app.apiResponseStyle, result);

            // 取得結果を設定
            self.plan().applyInfo = result.content.applyInfo;

            // 結果を即時反映
            self.plan.valueHasMutated();

            // 誕生日が3か月以内かどうか
            self.birthdayPopup();

            // シミュレーション実行
            if (self.isFreePlan()) {
				// 全商品の場合
                self.createBridgePay(true);
                self.createFinesavePay(true);
                self.createKeepPay(true);
                self.createCurePay(true);
                self.createCureLadyPay(true);
                self.createReliefWPay(true);
                self.createBelievePay(true);
                self.createCureSupportPay(true);
                self.createRiseSupportPay(true);
            } else if (self.isSelectPlan()) {
				// おすすめ商品の場合
                self.createBridgePay(true);
                self.createCurePay(true);
                self.createCureLadyPay(true);
                self.createBelievePay(true);
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {
            // alert('AJAXエラー発生');
            console.log("AJax Status: " + jqXHR.status + ", " + textStatus + ", errorThrown:" + errorThrown)
        });
    }

    self.showHelpModal = function(url){
        $.colorbox({
            href: '/estimate/_trend_bridge.html',
            innerWidth: "720px"
        });
    }

    /**
     * エラー表示用モーダルを表示する
     * @method showErrorModal
     * @param msg {string} メッセージテキスト
     */
    self.showErrorModal = function(msg){

        // HTML表示制御
        self.modalErrorMsg(msg); // HTML内のメッセージをセット
        self.showModal(true); // HTML側のモーダル表示フラグをON

        // colorbox設定
        $.colorbox({
            html: $('#errModal').html(),
            width: "760px",
            margin: "10px auto",
            className: "errorModal"
        });
    }

    /**
     * 入院給付金日額合計が1万円を超える場合のエラー表示用モーダル
     * @method showOverHospitalAmountMessage
     *
     */
    self.showOverHospitalAmountMessage = function(){
        // 全商品とおすすめ商品でメッセージ文言を変更する
        if (self.isFreePlan()) {
            var errMsg = '「新キュア」「新キュア・レディ」「リリーフ･ダブル」のうち複数商品を同時にお申込みいただける組合せは、入院給付金日額が合計10,000円までの場合となります。';

        } else if (self.isSelectPlan()) {
            var errMsg = '「新キュア」「新キュア・レディ」を同時にお申込みいただける組合せは、入院給付金日額が合計10,000円までの場合となります。';
        }
        self.showErrorModal(errMsg);
    }

    /**
     * 生年月日選択ダイアログ 年のセット
     * @method setYear
     */
    self.setYear = function(selectedYear, selectedMonth, selectedDay){
    	var today  = getTodayStr().replace('/', '');
        var tag = "";
        var y = today.substr(0,4);
        var maxY;
        var minY;

        if (self.index() == '1' || self.index() == '2'){
            maxY = y - 6;
        } else {
            maxY = y - 20;
        }
        if (self.isFreePlan()) {
            minY = y - 81;
        } else if (self.isSelectPlan()) {
            minY = y - 76;
        }

        // 現在の月を取得
        var m = today.substr(4, 2);

        //12月の場合
        if (m == 12) {
        	//年をひとつ増やす
        	maxY = maxY + 1;
        }

        var year='';
        self.birthdayYear.removeAll();
        for ( var i = minY; i <= maxY; i++) {
            self.birthdayYear.push({value: i, text: self.addGengo(i) });
            if (i == 1983) {
             self.birthdayYear.push({value: '', text: ''});
            }
        }

        // クエリパラメータで生年が指定されているときは設定する
        if (selectedYear && selectedMonth && selectedDay) {
            self.selectedBirthdayYear(selectedYear);
            self.setMonth(selectedMonth, selectedDay);
        } else {
            // 指定がなければ空を設定する
            self.selectedBirthdayYear('');
            self.setMonth();
        }
    }

    /**
     * 生年月日選択ダイアログ 月のセット
     * @method setMonth
     */
    self.setMonth = function(selectedMonth, selectedDay) {
    	var selectYear = self.selectedBirthdayYear();
    	var today  = getTodayStr().replace('/', '');
    	//現在選択されている「月」を、一時退避させる。
    	var val = self.selectedBirthdayMonth();

        // 最大年と最小年を設定 start
        var y = parseInt(today.substr(0, 4), 10);
        var maxY;
        var minY;
        var staMonth;
        var endMonth;

        //if (planType === '0') {
        if (self.index() == '1' || self.index() == '2'){
            maxY = y - 6;
        } else {
            maxY = y - 20;
        }
        if (self.isFreePlan()) {
            minY = y - 81;
        } else if (self.isSelectPlan()) {
            minY = y - 76;
        }
        // 現在の月を取得
        var m = parseInt(today.substr(4, 2), 10);

        //12月の場合
        if (m == 12) {
        	//年をひとつ増やす
        	maxY = maxY + 1;
        }

        // 選択年が最少年齢の場合
        staMonth = 1;
        endMonth = 12;
        if (selectYear == maxY) {
        	staMonth = 1;

        	//12月の場合
        	if (m == 12) {
        		endMonth = 1;
        	} else {
        		endMonth = m + 1;
        	}
        }
        // 選択年が最大年齢の場合
        if (selectYear == minY) {

        	staMonth = m;
        	endMonth = 12;
        }
        // プルダウン表示範囲一覧 end
        self.birthdayMonth.removeAll();
        self.birthdayMonth.push({value:  '' ,text: ''  });
        for ( var i = staMonth; i <= endMonth; i++) {
        	self.birthdayMonth.push({value:  i ,text: i  });
        }

        if (selectedMonth && selectedDay) {
            self.selectedBirthdayMonth(selectedMonth);
            self.setDay(selectedDay);
        } else {
            //一時退避させた「月」を取得し、選択状態に戻す。
            self.selectedBirthdayMonth(val);

            //日を再作成
            self.setDay();
        }

    };

    /**
     * 生年月日選択ダイアログ 日のセット
     * @method setDay
     */
    self.setDay = function(selectedDay) {

    	var year = self.selectedBirthdayYear();
    	var mon = self.selectedBirthdayMonth();
        var ml = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        var maxM;
        var val =  self.selectedBirthdayDay();

        if (mon == null || mon == '' || mon == 0) {
            mon = 1;
        }
        maxM = ml[mon - 1];

        self.birthdayDay.removeAll();
        self.birthdayDay.push({value:  '' ,text: ''  });
        for ( var i = 1; i <= maxM; i++) {
        	self.birthdayDay.push({value:  i ,text: i  });
        }
        if (mon == 2 && self.isLeapYea(year)) {
        	self.birthdayDay.push({value:  29 ,text: 29  });
        }

        if (selectedDay) {
            self.selectedBirthdayDay(selectedDay);
        } else {
            //一時退避させた「日」を取得し、選択状態に戻す。
            self.selectedBirthdayDay(val);
        }
    };

    /**
     * 生年月日選択ダイアログ うるう年判定
     * @method isLeapYea
     * @param year {string} 年
     */
    self.isLeapYea = function(year) {
        if ((year % 4) == 0 && (year % 100) != 0 || (year % 400) == 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 生年月日選択ダイアログ 年号のセット
     * @method addGengo
     * @param year {string} 年
     */
   self.addGengo= function(year) {
        var gengo;
        var y;

        if (1926 <= year && year < 1989) {
            gengo = "昭和";
            y = year - 1926 + 1;
        } else if (1989 <= year) {
            gengo = "平成";
            y = year - 1989 + 1;
        }
        if (y == 1) {
            return year + "（" + gengo + "元）";
        } else {
            return year + "（" + gengo + y + "）";
        }
    }

    /**
     * 商品情報開閉時のエフェクト処理（ko.bindingHandlers拡張）
     * @method slideVisible
     */
    ko.bindingHandlers.slideVisible = {
        // 監視対象のObservableデータ初期化時の処理
        init: function(element, valueAccessor) {
            var value = valueAccessor(); // Observableの値を取得
            ko.utils.unwrapObservable(value) ? $(element).show() : $(element).hide(); // 初期化時はエフェクトをかけないで可視制御
        },
        // 監視対象のObservableデータ変化時の処理
        update: function(element, valueAccessor) {
            var value = valueAccessor(); // Observableの値を取得
            ko.utils.unwrapObservable(value) ? $(element).slideDown(500) : $(element).slideUp(500); // jQueryのslideDownで対象要素をtoggleする
        }
    };

    /**
     * 個別の保険料計算時のローディング画像表示（ko.bindingHandlers拡張）
     * @method loadingImage
     *
     */
     ko.bindingHandlers.loadingImage = {
        // 監視対象のObservableデータ初期化時の処理
        init: function(element, valueAccessor) {
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).show() : $(element).hide();
        },
        // 監視対象のObservableデータ変化時の処理
        update: function(element, valueAccessor) {
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).show() : $(element).hide();
        }
     };

    /**
     * 印刷用の改ページを追加します
     * @method addPrintPageBreak
     */
    self.addPrintPageBreak = function() {
        // 全商品の場合
        if (self.isFreePlan()) {
            // page-break-beforeを初期化
            $('#curelady').css('page-break-before', '');
            $('#relief').css('page-break-before', '');
            $('#believe').css('page-break-before', '');
            $('#curesup').css('page-break-before', '');
            $('#rise').css('page-break-before', '');

            // その位置で強制的に改ページ（条件一致したらすぐreturn）
            if ($("#curelady").offset().top > 1200) {
                $('#curelady').css('page-break-before', 'always');
                return;
            }
            if ($("#relief").offset().top > 1200) {
                $('#relief').css('page-break-before', 'always');
                return;
            }
            if ($("#believe").offset().top > 1200) {
                $('#believe').css('page-break-before', 'always');
                return;
            }
            if ($("#curesup").offset().top > 1200) {
                $('#curesup').css('page-break-before', 'always');
                return;
            }
            if (self.index() != '3' && $("#rise").offset().top > 1200) {
                $('#rise').css('page-break-before', 'always');
                return;
            }
        }
    }

    /**
     * 補償額シミュレーションの表示
     * @method showLifePlan
     * @param なし
     * @returns なし
     */
    self.showLifePlan = function() {
        var w = window;
        var newWin;

        var contractAge = Number(self.contractAge());

        w.name = "mainWindow";

        newWin = w.open(
                'http://lifeplan.orixlife.jp/LINeS/jsp/index.do?hhAge='+ contractAge
                    + '&hhSex=' + self.selectedGender()
                    + '&spAge=' + (contractAge - 2),
                '_indexWin',
                'width=800,height=840,scrollbars=yes,status=yes,toolbar=esizno,location=no,menubar=no,rable=yes'
            );

        newWin.focus();
    };


    /**
     * メール送信ボタンの押下時の処理
     * @method clickSendMailButton
     */
    self.clickSendMailButton = function() {

    	// メッセージ初期化
        self.sendMailSuccessMessage('');
    	self.sendMailErrors('');

        // メール送信中のメッセージを表示させる。
    	self.isSending(true);

    	// シミュレーション結果メール送信API呼び出し
        var apiUrl = '/sim/api/send-mail';
        // ポストデータ作成
        var postData = {
            'content': {
            	'products': self.plan().products,
            	'applyInfo': self.plan().applyInfo,
            	'mailAddress': self.mailAddress()
            },
            '_token': 'testToken'
        }

        console.log('シミュレーション結果メール送信APIへのpostData↓');
        console.log(postData);

        app.ajax(apiUrl, postData, true)
        .done(function(result, textStatus, jqXHR) {

        	console.log('シミュレーション結果メール送信API結果↓');
            console.log(result);

            // メール送信中のメッセージを非表示にさせる。
            self.isSending(false);

            // メール送信ボタン押下後のメッセージを表示させる。
            self.isClickSendMailButton(true);

            if (result.content.hasValidationErrors) {
                // バリデーションエラーが発生したら
                self.sendMailErrors(result.content.validationErrors);
            } else {
                // バリデーションチェックOK
            	self.sendMailSuccessMessage('メールの送信が完了しました。');
            }
        })
    };


    /**
     * メールアドレスのテキストボックスクリック時の処理
     * @method clickSendMailButton
     */
    self.clickEstSendmail = function() {
        // メール送信ボタン押下後のメッセージをリセットする。
    	self.isClickSendMailButton(false);
    };

    /**
     * シミュレーション結果を保存する・お申込み手続きへのボタンを活性するかどうか
     * @method isEnableButton
     */
    self.isEnableButton = ko.computed(function() {
        // 全商品の場合
        if (self.isFreePlan()) {
            // ひとつでも商品が選択されていない場合は、falseを返してボタンを非活性化
            if (!self.isSelectedBridge() && !self.isSelectedFineSave() && !self.isSelectedKeep() && !self.isSelectedCure() &&
                !self.isSelectedCureLady() && !self.isSelectedReliefW() && !self.isSelectedBelieve() && !self.isSelectedCureSupport() &&
                !self.isSelectedRiseSupport()) {
                return false;
            }
        // おすすめ商品の場合
        } else if (self.isSelectPlan()) {
            // ひとつでも商品が選択されていない場合は、falseを返してボタンを非活性化
            if (!self.isSelectedBridge() && !self.isSelectedCure() && !self.isSelectedCureLady() && !self.isSelectedBelieve()) {
                return false;
            }
        }
        return true;
    });

    /**
     * 「お申込み手続きへ」ボタン押下で次画面に遷移時、initializePropertyに値をセット
     * @method setInitializeProperty
     */
    self.setInitializeProperty = function() {
        // 選択した商品の商品コードを配列に詰める
        var p = [];
        if (self.isSelectedBridge()) {
            p.push('3G');
        }
        if (self.isSelectedFineSave()) {
            p.push('37');
        }
        if (self.isSelectedKeep()) {
            p.push('3F');
        }
        if (self.isSelectedCure()) {
            p.push('4C');
        }
        if (self.isSelectedCureLady()) {
            p.push('4A');
        }
        if (self.isSelectedReliefW()) {
            p.push('1P');
        }
        if (self.isSelectedBelieve()) {
            p.push('1V');
        }
        if (self.isSelectedCureSupport()) {
            p.push('1W');
        }
        if (self.isSelectedRiseSupport()) {
            p.push('1Y');
        }

        // 生年月日をセット
        self.plan().initializeProperty.birthday = self.selectedBirthday();
        // 契約年齢をセット
        self.plan().initializeProperty.age = self.contractAge();
        // 性別をセット
        self.plan().initializeProperty.strsex = self.selectedGender();
        // 商品コードをセット
        self.plan().initializeProperty.p = p;

        // 結果を即時反映
        self.plan.valueHasMutated();
    };

    /**
     * 保険料計算対象フラグを初期化
     * @method initIsCalcTarget
     * @param force {boolean} true: 商品すべてを計算対象とする, false: 商品すべてを計算対象としない
     */
    self.initIsCalcTarget = function(force) {
        ko.utils.arrayForEach(self.products(), function(product){
            // 商品の保険料計算対象フラグ（サーバからのレスポンス）がtrueの場合は、保険料ロード用の画像表示フラグをfalseにする
            switch (product.productCd) {
                case "3G":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetBridge(false);
                        } else if (force && self.isSelectPlan()) {
                            self.isCalcTargetBridgeBasic(false);
                            self.isCalcTargetBridgeRich(false);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetBridgeBasic(false);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetBridgeRich(false);
                        }
                    }
                    break;
                case "37":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetFineSave(false);
                        }
                    }
                    break;
                case "3F":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetKeep(false);
                        }
                    }
                    break;
                case "4C":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetCure(false);
                        } else if (force && self.isSelectPlan()) {
                            self.isCalcTargetCureBasic(false);
                            self.isCalcTargetCureRich(false);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetCureBasic(false);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetCureRich(false);
                        }
                    }
                    break;
                case "4A":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetCureLady(false);
                        } else if (force && self.isSelectPlan()) {
                            self.isCalcTargetCureLadyBasic(false);
                            self.isCalcTargetCureLadyRich(false);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetCureLadyBasic(false);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetCureLadyRich(false);
                        }
                    }
                    break;
                case "1P":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetReliefW(false);
                        }
                    }
                    break;
                case "1V":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetBelieve(false);
                        } else if (force && self.isSelectPlan()) {
                            self.isCalcTargetBelieveBasic(false);
                            self.isCalcTargetBelieveRich(false);
                        } else if (self.isSelectPlanBasic()) {
                            self.isCalcTargetBelieveBasic(false);
                        } else if (self.isSelectPlanRich()) {
                            self.isCalcTargetBelieveRich(false);
                        }
                    }
                    break;
                case "1W":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetCureSupport(false);
                        }                        
                    }                  
                    break;
                case "1Y":
                    if (product.isCalcTarget) {
                        if (self.isFreePlan()) {
                            self.isCalcTargetRiseSupport(false);
                        }                        
                    }                
                    break;
                default:
                    break;
            }
        });

        // 商品の保険料計算対象フラグ（サーバからのレスポンス）を初期化
        ko.utils.arrayForEach(self.products(), function(product){
            product.isCalcTarget = false;
        });
    };

    /**
     * 誕生日が3か月以内かどうか
     * @method birthdayPopup
     */
    self.birthdayPopup = function () {
        var tm = parseInt(self.plan().systemSetting.today.substr(4, 2));
        var td = parseInt(self.plan().systemSetting.today.substr(6, 2));
        var bm = parseInt(self.selectedBirthdayMonth());
        var bd = parseInt(self.selectedBirthdayDay());
        var diff = bm - tm;
        if (((diff === 0 && td < bd) || (1 <= diff && diff <= 2) ||
        ((diff === 3 || diff === -9) && td >= bd) || (diff <= -10)) &&
        (self.isFreePlan() || (self.isSelectPlan() && self.contractAge() <= 75))) {
            // 誕生日が近い人の吹き出し表示フラグをtrue
            self.showBirthdayPopup(true);
        } else {
            // 誕生日が近い人の吹き出し表示フラグをfalse
            self.showBirthdayPopup(false);
        }
    };

};

