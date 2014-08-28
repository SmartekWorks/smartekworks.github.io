/**
 * DOM初期ロード（jQueryベース）
 * @class simulation
 * @constructor
 */
$(function () {
    $('#1').text((new Date()).getTime());
    var app = new App();    // WebCas共通オブジェクト生成

    $('#2').text((new Date()).getTime());

    var propertyText = '{"prop":{"prop31":"男", "prop32":"年齢"}}';
    var property = JSON.parse(propertyText);

    var initializeProperty = JSON.parse($('#initializeProperty').val());
    
    if ( !(initializeProperty.p.length > 0) ) {
        initializeProperty.p = self.setProductCode(initializeProperty.index);
    }

    $('#3').text((new Date()).getTime());

    // 初期化用APIに投げるPostDataを作成する
    var postData = {
        'status': 'OK',
        '_token': 'testToken',
        'position': 'simulation',
        'content': { 'initializeProperty': initializeProperty }
    };

    $('#4').text((new Date()).getTime());

    console.log('%ccreate-initial-simulation-dataへのpostData:', app.apiRequeStyleStyle, postData);
    
    // 初期化用APIを実行
    var resultData = {"content":{"isLoggedIn":false,"selectedPlan":"basic","pSum":null,"pSum2":null,"initializeProperty":{"index":"5","birthday":null,"age":null,"strsex":null,"p":["3G","4C"],"ag":null,"sl":null,"genderctl":null,"oKL":null},"agency":{"agencyName":null,"zipCode":null,"address":null,"tel":null,"agencyCode":null,"salesmanCode":null,"intentionConfirmPost":null,"intentionConfirmName":null,"agencyType":null,"keyline":null},"systemSetting":{"today":"20140828"},"member":{"mailAddress":null,"mailAddress2":null,"loginId":null,"password":null,"password2":null,"mailAccept":null},"contract":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"genderText":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"addressKana1":null,"addressKana2":null,"addressKana3":null,"addressKana12":null,"addressKana23":null,"telNo11":null,"telNo12":null,"telNo13":null,"telNo21":null,"telNo22":null,"telNo23":null,"contractReaded":null,"contractMypageReaded":null},"descriptionMind":{"descriptionMindUrl":null,"isClickedDescriptionMindUrl":null,"attentionCheck":null,"descriptionCheck":null},"description":{"intention1Check":null,"intention2Check":null,"intention3Check":null,"intention4Check":null,"intention5Check":null,"intention6Check":null},"request":{"request1Check":null,"request2Check":null,"request3Check":null},"notice":{"noticeA":{"selectedNoticeA1":null,"selectedNoticeA2":null,"selectedNoticeA3":null,"selectedNoticeA4":null,"selectedNoticeA5":null,"selectedNoticeA6":null,"selectedNoticeA7":null,"noticeADetails":[]},"noticeB":{"selectedNoticeB1":null,"noticeBDetails":[]},"noticeD":{"hyperTension":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"hyperTensionMax":null,"hyperTensionMin":null},"dyslipidemia":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"neutralFat":null,"hdlc":null,"ldlc":null},"diabetes":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"hba1c":null,"fastingBloodSugar":null},"hyperUricemia":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"uricemia":null},"fattyLiver":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"got":null,"gpt":null,"gtp":null},"anemia":{"year":[],"selectedYear":null,"month":[],"selectedMonth":null,"hb":null}},"noticeC":{"selectedNoticeC1":null,"noticeCDetails":[]},"noticeCs":{"selectedNoticeCs1":null,"selectedNoticeCs2":null,"selectedNoticeCs3":null,"selectedNoticeCs4":null},"noticeBl":{"selectedNoticeBl1":null,"selectedNoticeBl2":null,"selectedNoticeBl3":null},"noticeCommon":{"height":null,"weight":null,"yearlyIncome":null,"selectedOtherDeath":null,"otherDeathAmount":null,"selectedOtherDeathContinue":null,"selectedOtherHospital":null,"otherHospitalAmount":null,"selectedOtherHospitalContinue":null,"selectedJob":null,"otherJob":null,"school":null,"selectedPersonalityPosition":null,"selectedPersonality":null,"otherPersonality":null,"jobName":null,"jobTelNo1":null,"jobTelNo2":null,"jobTelNo3":null}},"credit":{"cardNo":null,"selectedCardYear":null,"selectedCardMonth":null,"securityCode":null,"selectedEnquete":null},"accountTransfer":{"isAgreement":null,"selectedEnquete":null},"applyInfo":{"paymentType":0,"paymentCount":"m","gender":"","formattedBirthday":null,"birthdayYear":null,"birthdayMonth":null,"birthdayDay":null,"contractAge":{"a1":null,"a6":null,"a12":null}},"products":[{"isSelected":true,"selectable":true,"isCalcTarget":null,"productCd":"3G","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"isExpansion":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"isExpansion":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"isExpansion":null}}},"productMasterInfo":{"productGroupName":"\u6b7b\u4ea1\u4fdd\u967a","productName":"Bridge [\u30d6\u30ea\u30c3\u30b8]","isMedicalInsurance":false,"isCancerInsurance":false,"isLifetimeInsurance":true,"isRelaxationInsurance":false,"hasAdvancedMedical":false,"pcApplicable":true,"letterApplicable":false,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"37","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null,"insurancePeriod":[],"selectedInsurancePeriod":null}}},"productMasterInfo":{"productGroupName":"\u6b7b\u4ea1\u4fdd\u967a","productName":"FineSave [\u30d5\u30a1\u30a4\u30f3\u30bb\u30fc\u30d6]","isMedicalInsurance":false,"isCancerInsurance":false,"isLifetimeInsurance":true,"isRelaxationInsurance":false,"hasAdvancedMedical":false,"pcApplicable":false,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"3F","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"monthlyPension":[],"selectedMonthlyPension":null,"paymentGuranteePeriod":[],"selectedPaymentGuranteePeriod":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"benefitLumpPay":null,"isExpansion":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"monthlyPension":[],"selectedMonthlyPension":null,"paymentGuranteePeriod":[],"selectedPaymentGuranteePeriod":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"benefitLumpPay":null,"isExpansion":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"monthlyPension":[],"selectedMonthlyPension":null,"paymentGuranteePeriod":[],"selectedPaymentGuranteePeriod":null,"insurancePeriod":[],"selectedInsurancePeriod":null,"benefitLumpPay":null,"isExpansion":null}}},"productMasterInfo":{"productGroupName":"\u6b7b\u4ea1\u4fdd\u967a(\u53ce\u5165\u4fdd\u969c\u4fdd\u967a)","productName":"Keep [\u30ad\u30fc\u30d7]","isMedicalInsurance":false,"isCancerInsurance":false,"isLifetimeInsurance":true,"isRelaxationInsurance":false,"hasAdvancedMedical":false,"pcApplicable":true,"letterApplicable":false,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":true,"selectable":true,"isCalcTarget":null,"productCd":"4C","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}}},"productMasterInfo":{"productGroupName":"\u533b\u7642\u4fdd\u967a","productName":"\u65b0CURE [\u30ad\u30e5\u30a2]","isMedicalInsurance":true,"isCancerInsurance":false,"isLifetimeInsurance":false,"isRelaxationInsurance":false,"hasAdvancedMedical":true,"pcApplicable":true,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"4A","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"hospitalAmount":[],"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"selectedCancerOption":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}}},"productMasterInfo":{"productGroupName":"\u533b\u7642\u4fdd\u967a","productName":"\u65b0CURE Lady [\u30ad\u30e5\u30a2\u30fb\u30ec\u30c7\u30a3]","isMedicalInsurance":true,"isCancerInsurance":false,"isLifetimeInsurance":false,"isRelaxationInsurance":false,"hasAdvancedMedical":true,"pcApplicable":true,"letterApplicable":true,"manApplicable":false,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"1P","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"selectedAdvancedMedical":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}}},"productMasterInfo":{"productGroupName":"\u6b7b\u4ea1\u4fdd\u969c\u4ed8\u533b\u7642\u4fdd\u967a","productName":"Relief W [\u30ea\u30ea\u30fc\u30d5\u30fb\u30c0\u30d6\u30eb]","isMedicalInsurance":true,"isCancerInsurance":false,"isLifetimeInsurance":false,"isRelaxationInsurance":false,"hasAdvancedMedical":true,"pcApplicable":true,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"1V","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"amount":[],"selectedAmount":null,"selectedCancerAdvancedMedical":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"amount":[],"selectedAmount":null,"selectedCancerAdvancedMedical":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"amount":[],"selectedAmount":null,"selectedCancerAdvancedMedical":null,"selectedCancerOutpatient":null,"insurancePaymentPeriod":[],"selectedInsurancePaymentPeriod":null}}},"productMasterInfo":{"productGroupName":"\u304c\u3093\u4fdd\u967a","productName":"Believe [\u30d3\u30ea\u30fc\u30d6]","isMedicalInsurance":false,"isCancerInsurance":true,"isLifetimeInsurance":false,"isRelaxationInsurance":false,"hasAdvancedMedical":false,"pcApplicable":true,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"1W","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"relaxationLifetimeInsurance":[],"selectedRelaxationLifetimeInsurance":null,"selectedRelaxationAdvancedMedical":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"relaxationLifetimeInsurance":[],"selectedRelaxationLifetimeInsurance":null,"selectedRelaxationAdvancedMedical":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"selectedHospitalAmount":null,"relaxationLifetimeInsurance":[],"selectedRelaxationLifetimeInsurance":null,"selectedRelaxationAdvancedMedical":null}}},"productMasterInfo":{"productGroupName":"\u5f15\u53d7\u57fa\u6e96\u7de9\u548c\u578b\u533b\u7642\u4fdd\u967a","productName":"CURE Support [\u30ad\u30e5\u30a2\u30fb\u30b5\u30dd\u30fc\u30c8]","isMedicalInsurance":true,"isCancerInsurance":false,"isLifetimeInsurance":false,"isRelaxationInsurance":true,"hasAdvancedMedical":true,"pcApplicable":true,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}},{"isSelected":false,"selectable":true,"isCalcTarget":null,"productCd":"1Y","descriptionPdfUrl":null,"isClickedDescriptionPdfUrl":null,"clausePdfUrl":null,"isClickedClausePdfUrl":null,"plans":{"standard":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null}},"basic":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null}},"rich":{"premiums":{"p1":null,"p6":null,"p12":null},"productInfo":{"insuranceAmount":[],"selectedInsuranceAmount":null}}},"productMasterInfo":{"productGroupName":"\u5f15\u53d7\u57fa\u6e96\u7de9\u548c\u578b\u7d42\u8eab\u4fdd\u967a","productName":"RISE Support [\u30e9\u30a4\u30ba\u30fb\u30b5\u30dd\u30fc\u30c8]","isMedicalInsurance":false,"isCancerInsurance":false,"isLifetimeInsurance":true,"isRelaxationInsurance":true,"hasAdvancedMedical":false,"pcApplicable":false,"letterApplicable":true,"manApplicable":true,"womanApplicable":true},"beneficiary":{"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null,"formattedBirthday":null,"selectedBirthdayYear":null,"selectedBirthdayMonth":null,"selectedBirthdayDay":null,"isSameAddress":null,"zipCode":null,"prefectureCd":null,"address1":null,"address2":null,"livingNeeds":null},"claimant":{"hasClaimant":null,"familyName":null,"firstName":null,"familyNameKana":null,"firstNameKana":null,"relationship":null}}],"calcDate":null,"isFirstPaymentType":null,"isAuthorityError":null,"accountTransferGw":{"errorType":null,"isOver":null},"hasValidationErrors":false,"validationErrors":[]},"status":null,"_token":"5n8cK6ysQrMBjpDnJxOybuZau5A5RytHuyK3LjMA","position":"simulation"};
    $('#5').text((new Date()).getTime());

    var resultConst = app.GetConstants();
    $('#6').text((new Date()).getTime());
    // 初期データ取得成功
    console.log('%ccreate-initial-simulation-dataの結果:', app.apiResponseStyle, resultData);
    $('#7').text((new Date()).getTime());
 });

/**
 * カンマ区切りに変換して返却します
 * @param {int} i カンマで区切られていない数字
 * @returns {int} 3桁毎にカンマで区切られた数字
 */
function addComma(i) {
    return String(i).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

/**
 * 数値を万以上の円単位に変換して返却します
 * @param {int} i カンマで区切られていない数字
 * @returns {string} 万以上の円単位
 */
function numChangeMoney(num) {
    var figure = ['万円', '億円', '兆円', '京円'];
    var nums = String(num).replace(/(\d)(?=(\d\d\d\d)+$)/g, "$1,").split(",").reverse();
    var data = '';
    for(var i=0;i<nums.length;i++){
        if(!nums[i].match(/^[0]+$/)){
            data = nums[i].replace(/^[0]+/g, "") + figure[i-1] + data;
        }
    }
    return data;
}

/**
 * 現在日をyyyyMMddの形式の文字列で返却する
 * @returns {string} yyyyMMdd形式の文字列
 */
function getTodayStr() {
    var date = new Date();  
    var year = date.getFullYear();  
    var month = date.getMonth() + 1;  
    var day = date.getDate();  

    if ( month < 10 ) {  
      month = '0' + month;  
    }  
    if ( day < 10 ) {  
      day = '0' + day;  
    }  

    var str = year + '/' + month + '/' + day;  
    return str
}

/**
 * ページ種別ごとにデフォルトの商品を設定する
 * @param {string} index ページ種別
 * @returns {array} 商品コードの配列
 *
 */
function setProductCode(index) {
    var productCode = [];
    switch (index) {
        case "1":
            productCode.push("3G");   // ブリッジ
            productCode.push("4C");   // 新キュア
            break;
        case "2":
            productCode.push('37');   // ファイン・セーブ
            productCode.push('4C');   // 新キュア
            productCode.push('4A');   // 新キュア・レディ
            productCode.push('1P');   // リリーフ・ダブル
            productCode.push('1V');   // ビリーブ
            productCode.push('1W');   // キュア・サポート
            productCode.push('1Y');   // ライズ・サポート
            break;
        case "3":
            productCode.push('3G');   // ブリッジ
            productCode.push('4C');   // 新キュア
            productCode.push('4A');   // 新キュア・レディ
            productCode.push('1V');   // ビリーブ
            break;
        case "4":
            productCode.push('3G');   // ブリッジ
            productCode.push('4C');   // 新キュア
            break;
        case "5":
            productCode.push('3G');   // ブリッジ
            productCode.push('4C');   // 新キュア
            break;
        case "6":
            productCode.push('4C');   // 新キュア
            productCode.push('4A');   // 新キュア・レディ
            productCode.push('1V');   // ビリーブ        
            break;
        default:
            break;
    }
    return productCode;
}