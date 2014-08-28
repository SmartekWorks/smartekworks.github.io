/**
 * Webcas共通処理クラス
 * @class App
 * @constructor
 */
function App() {
	var self = this;

	// Global Config
	self.siteUrl = "";
	self.errorLogEndpoint = "/api/posterror";

    /**
     * for debug
     */
    self.apiRequeStyleStyle = "color:black;background-color:lightblue;";
    self.apiResponseStyle = "color:black;background-color:pink;";

	/**
     * WebcasサーバへAjax通信を行う
	 * @method ajax
	 * @param  endpoint {string} エンドポイント
	 * @param  postData {Object} Ajaxで送信するデータ
     * @param  isScreenTransition {boolean} 画面遷移を伴う場合true, 画面遷移しない場合false
	 * @return {Object} $.ajaxオブジェクトをコールバック可能状態で返却
	 */
	self.ajax = function(endpoint, postData, isScreenTransition){

        // _tokenが設定されていない場合、画面から取得して設定する
        if (!postData._token){
            postData._token = $('#_token').val();
        }

		var postBody = ko.toJSON(postData)	// POST送信データをJSONに変換

		return $.ajax({
            url: self.siteUrl + endpoint,
            type: "POST",
            contentType: "application/json",
            data: postBody,
            dataType: "json"
        })
        .done(function( result, textStatus, jqXHR) {
            // tokenの詰め替え
            self.refillToken(postData, result);
        })
        .fail(function( jqXHR, textStatus, errorThrown ) {

            // エラーログオブジェクト定義
            var ajaxErrorLog = {
                errorAt: new Date(),
                ua: navigator.userAgent,
                statusCode : jqXHR.status,
                textStatus: textStatus,
                errorThrown: errorThrown,
                errorEndpoint: endpoint,
                errorPostData: postBody
            }

            // サーバへエラーを送信する関数を呼び出し
            self.reportAjaxError(ajaxErrorLog)
            .always(function() {
                // 画面遷移を伴うエラーの場合は、リダイレクト処理を行う
                if (isScreenTransition) {
                    // エラー発生時の画面リダイレクト処理
                    if(jqXHR.status == 404 ) {
                        // 404はページが見つかりませんエラー画面
                        location.href = self.siteUrl + '/error/404';
                    } else if(jqXHR.status >= 500) {
                        // 500番台はシステムエラー画面
                        location.href = self.siteUrl + '/error/500';
                    }
                }

                // 画面遷移を伴わない場合は、各ViewModel内でエラー表示の処理を行う
            });
		});
	}

	// Ajax(local data読み込み)・・・テスト用
	self.localAjax = function(endpoint, postData){
		return $.ajax({
            url: endpoint,
            type: "POST",
            contentType: "application/json",
            data: ko.toJSON(postData),
            dataType: "json"
        });
	}

	/**
     * Tokenの詰め替え処理を行う
     * @method refillToken
     * @param postData {Object} Ajax通信時にpostされたデータ
     * @param result {Object} Ajax通信成功時にサーバーから返されたデータ
     */
	self.refillToken = function(postData, result) {
		postData._token = result._token;
	};

	/**
     * 表示画面の設定
	 * @method updateViewSettings
	 * @param  page {string} Historyで利用するページ名
	 * @param  title {string} ページタイトル
	 */
    self.updateViewSettings = function(page, title){
        console.log('call updateViewSettings page="' + page + '"');

        document.title = title; // 画面タイトル設定
        History.pushState({state:page}, title, '?state=' + page);    // ページURL、履歴設定

        // TODO: SiteCatalyst通信(実装されるまではコメントアウト)
        // self.callSiteCatalystOnEvent('/api/site-catalyst/get-json', page);

        // スクロール位置設定
        $('html,body').animate({ scrollTop: 0 },  {duration: 100, easing: 'swing'});
    };

    /**
     * SiteCatalyst通信を行う(ページロード時)
     * @method callSiteCatalystOnLoad
     * @param jsonUrl {string} デフォルト設定値の取得先URL
     * @param action {string} action識別子
     * @param property {Object} デフォルト設定値に設定を上書きしたい場合は指定
     */
    self.callSiteCatalystOnLoad = function (jsonUrl, action, property){

        // JSONデータ読込
        $.ajax(jsonUrl, {
            type: "POST",
            data: {
                action: action
            },
            dataType: "json"
        })
        .done(function (result, textStatus, jqXHR) {
            // for debug
            // console.log("Ajax Status: " + jqXHR.status + ", " + textStatus);
            // console.log(result);

            // 動的に設定する必要のあるプロパティを取り込むため、JSONオブジェクトをマージ
            $.extend(true, result, property);

            // ページ内のSiteCatalystオブジェクトにプロパティを設定する
            self.setPropertyForSiteCatalyst(result);

            // SiteCatalystへデータを送信する
            var s_code=s.t();
            if(s_code)document.write(s_code);

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // alert('Ajaxエラー発生');
            console.log("Ajax Status: " + jqXHR.status + ", " + textStatus + ", errorThrown" + errorThrown)
        });
    };

    /**
     * SiteCatalyst通信を行う(イベント発生時など任意のタイミング)
     * @method callSiteCatalystOnEvent
     * @param jsonUrl {string} デフォルト設定値の取得先URL
     * @param action {string} action識別子
     * @param property {Object} デフォルト設定値に設定を上書きしたい場合は指定
     */
    self.callSiteCatalystOnEvent = function (jsonUrl, action, property){

        // JSONデータ読込
        $.ajax(jsonUrl, {
            type: "POST",
            data: {
                action: action
            },
            dataType: "json"
        })
        .done(function (result, textStatus, jqXHR) {
            // for debug
            // console.log("Ajax Status: " + jqXHR.status + ", " + textStatus);
            // console.log(result);

            // 動的に設定する必要のあるプロパティを取り込むため、JSONオブジェクトをマージ
            $.extend(true, result, property);

            // ページ内のSiteCatalystオブジェクトにプロパティを設定する
            self.setPropertyForSiteCatalyst(result);

            // SiteCatalystへデータを送信する
            s.tl(true, 'o', 'SiteCatalystTest');

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // alert('Ajaxエラー発生');
            console.log("Ajax Status: " + jqXHR.status + ", " + textStatus + ", errorThrown" + errorThrown)
        });

    };

    /**
     * ページ内のSiteCatalystオブジェクトのプロパティに値を設定する
     * @method setPropertyForSiteCatalyst
     * @param o {Object} 設定する値の入ったオブジェクト
     */
    self.setPropertyForSiteCatalyst = function (o) {
        s.pageName = o.pageName;
        s.channel = o.channel;
        s.server = o.server;
        s.pageType = o.pageType;
        s.prop1 = o.prop.prop1;
        s.prop2 = o.prop.prop2;
        s.prop3 = o.prop.prop3;
        s.prop4 = o.prop.prop4;
        s.prop5 = o.prop.prop5;
        s.prop6 = o.prop.prop6;
        s.prop7 = o.prop.prop7;
        s.prop8 = o.prop.prop8;
        s.prop9 = o.prop.prop9;
        s.prop10 = o.prop.prop10;
        s.prop11 = o.prop.prop11;
        s.prop12 = o.prop.prop12;
        s.prop13 = o.prop.prop13;
        s.prop14 = o.prop.prop14;
        s.prop15 = o.prop.prop15;
        s.prop16 = o.prop.prop16;
        s.prop17 = o.prop.prop17;
        s.prop18 = o.prop.prop18;
        s.prop19 = o.prop.prop19;
        s.prop20 = o.prop.prop20;
        s.prop21 = o.prop.prop21;
        s.prop22 = o.prop.prop22;
        s.prop23 = o.prop.prop23;
        s.prop24 = o.prop.prop24;
        s.prop25 = o.prop.prop25;
        s.prop26 = o.prop.prop26;
        s.prop27 = o.prop.prop27;
        s.prop28 = o.prop.prop28;
        s.prop29 = o.prop.prop29;
        s.prop30 = o.prop.prop30;
        s.prop31 = o.prop.prop31;
        s.prop32 = o.prop.prop32;
        s.prop33 = o.prop.prop33;
        s.prop34 = o.prop.prop34;
        s.prop35 = o.prop.prop35;
        s.prop36 = o.prop.prop36;
        s.prop37 = o.prop.prop37;
        s.prop38 = o.prop.prop38;
        s.prop39 = o.prop.prop39;
        s.prop40 = o.prop.prop40;
        s.hier1 = o.hier1;
        s.campaign = o.campaign;
        s.state = o.state;
        s.zip = o.zip;
        s.events = o.events;
        s.products = o.products;
        s.purchaseID = o.purchaseID;
        s.eVar1 = o.eVar.eVar1;
        s.eVar2 = o.eVar.eVar2;
        s.eVar3 = o.eVar.eVar3;
        s.eVar4 = o.eVar.eVar4;
        s.eVar5 = o.eVar.eVar5;
        s.eVar6 = o.eVar.eVar6;
        s.eVar7 = o.eVar.eVar7;
        s.eVar8 = o.eVar.eVar8;
        s.eVar9 = o.eVar.eVar9;
        s.eVar10 = o.eVar.eVar10;
        s.eVar11 = o.eVar.eVar11;
        s.eVar12 = o.eVar.eVar12;
        s.eVar13 = o.eVar.eVar13;
        s.eVar14 = o.eVar.eVar14;
        s.eVar15 = o.eVar.eVar15;
        s.eVar16 = o.eVar.eVar16;
        s.eVar17 = o.eVar.eVar17;
        s.eVar18 = o.eVar.eVar18;
        s.eVar19 = o.eVar.eVar19;
        s.eVar20 = o.eVar.eVar20;
        s.eVar21 = o.eVar.eVar21;
        s.eVar22 = o.eVar.eVar22;
        s.eVar23 = o.eVar.eVar23;
        s.eVar24 = o.eVar.eVar24;
        s.eVar25 = o.eVar.eVar25;
        s.eVar26 = o.eVar.eVar26;
        s.eVar27 = o.eVar.eVar27;
        s.eVar28 = o.eVar.eVar28;
        s.eVar29 = o.eVar.eVar29;
        s.eVar30 = o.eVar.eVar30;
        s.eVar31 = o.eVar.eVar31;
        s.eVar32 = o.eVar.eVar32;
        s.eVar33 = o.eVar.eVar33;
        s.eVar34 = o.eVar.eVar34;
        s.eVar35 = o.eVar.eVar35;
        s.eVar36 = o.eVar.eVar36;
        s.eVar37 = o.eVar.eVar37;
        s.eVar38 = o.eVar.eVar38;
        s.eVar39 = o.eVar.eVar39;
        s.eVar40 = o.eVar.eVar40;
        s.linkTrackVars = o.linkTrackVars;
        s.linkTrackEvents = o.linkTrackEvents;
        s.transactionID = o.transactionID;
    };

    /**
     * 定数を取得する
     * @method GetConstants
     * @return {Object} constAPIを呼び出した$.ajaxオブジェクト
     */
    self.GetConstants = function(){
        return {"content":{"product":{"productCode":{"BRIDGE":"3G","FINE_SAVE":"37","KEEP":"3F","CURE":"1T","NEW_CURE":"4C","CURE_LADY":"1R","NEW_CURE_LADY":"4A","RELIEF_W":"1P","BELIEVE":"1V","CURE_SUPPORT":"1W","RISE_SUPPORT":"1Y","RISE":"4N","ADVANCED_MEDICAL":"7D","CANCER_OPTION":"7G","CANCER_OUTPATIENT":"7H","WOMAN_HOSPITAL":"7A","CANCER_ADVANCED_MEDICAL":"7E","HOSPITAL_MEDICAL_60":"6W","RELAXATION_ADVANCED_MEDICAL":"7F","RELAXATION_LIFETIME_INSURANCE":"8F"}},"insuranceRoute":{"STANDARD_DIRECT":1,"STANDARD_AGENCY_SIMULATION":2,"STANDARD_AGENCY":3,"RECOMMEND_AGENCY":4,"RECOMMEND_DIRECT":5,"RECOMMEND_INHOUSE":6}},"status":null,"_token":"5n8cK6ysQrMBjpDnJxOybuZau5A5RytHuyK3LjMA","position":null};
    };

    /**
     * BlockUIデフォルト設定
     * @method InitBlockUI
     */
    self.InitBlockUI = function(){
        // $.blockUI.defaults = {
        //     message: "<img src='http://54.92.109.84/mypage/images/sim/loader-lg.gif'></img>",
        //     css : {
        //         padding: 0,
        //         margin: 0,
        //         width: '30%',
        //         top: '40%',
        //         left: '35%',
        //         textAlign: 'center',
        //         cursor: 'wait'
        //     },
        //     overlayCSS:  {
        //         backgroundColor: '#FFFFFF',
        //         opacity: 0.6,
        //         cursor: 'wait'
        //     },
        //     fadeIn:  200,
        //     fadeOut:  400,
        //     showOverlay: true,
        // };
    }();
}

/**
 * Webcas共通ユーティリティクラス
 * @class AppUtil
 * @constructor
 * @param viewModel {Object} 処理対象のビューモデル
 */
function AppUtil(viewModel) {
    var self = this;

    /**
     * 半角文字を全角に変換する（全ての文字種別）
     * @function toZenkakuAll
     * @param target {string} 変換対象の項目名文字列
     */
    self.toZenkakuAll = function(target){

        // 変数セット
        var strHyphen = 'ー'; // ハイフンは「全角長音（文字コード: 12540）」を指定
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // プラグイン未対応の文字を個別に変換
        targetString = targetString.replace(/ｳﾞ/g, 'ヴ'); // 半角「ｳﾞ」を全角「ヴ(文字コード: 12532)」に変換
        targetString = targetString.replace(/ｯ/g, 'ッ'); // 半角「ｯ」を全角「ツ」に変換
        targetString = targetString.replace(/-/g, '－'); // 半角ハイフン(文字コード: 45)を全角ハイフンに変換

        // プラグイン機能にて半角を全角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        targetString = stc.autoConvert(targetString, {
            widthMode: 'toZenkaku', // 変換モードを半角->全角に設定
            kanaMode: false, // ひらがなをカタカナに変換はしない
            hankakuKatakanaMustDie: true, // 半角カタカナは全角カタカナに変換
            convert: {
                punctuation: true,  // カンマ、ピリオド、読点、句点を全角に変換
                tilda: true, // 半角「~」をにzenkakuChildaで指定した文字に変換
                exclamation: true, // 半角「!」を全角「！」に変換
                question: true,  // 半角「!」を全角「！」に変換
                space: true,  // 半角スペースを全角スペースに変換
                hyphen: true // 半角「-」「ｰ」をにzenkakuHyphenで指定した文字に変換
            },
            zenkakuHyphen: strHyphen, // 全角ハイフンの文字を指定
            zenkakuChilda: '〜'
        });

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }

    /**
     * 半角文字を全角に変換する（主にカナ姓名）
     * @function toZenkakuName
     * @param target {string} 変換対象の項目名文字列
     */
    self.toZenkakuName = function(target){

        // 変数セット
        var strHyphen = '－'; // ハイフンは「全角ハイフン（文字コード: 65293）」を指定
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // プラグイン未対応の文字を個別に変換
        targetString = targetString.replace(/ｳﾞ/g, 'ヴ'); // 半角「ｳﾞ」を全角「ヴ(文字コード: 12532)」に変換
        targetString = targetString.replace(/ｯ/g, 'ッ'); // 半角「ｯ」を全角「ツ」に変換
        targetString = targetString.replace(/-/g, strHyphen); // 半角ハイフン(文字コード: 45)を全角ハイフンに変換
        targetString = targetString.replace(/ｰ/g, strHyphen); // 半角長音(文字コード: 65392)を全角ハイフンに変換
        targetString = targetString.replace(/ー/g, strHyphen); // 全角長音(文字コード: 12540)を全角ハイフンに変換

        // プラグイン機能にて半角を全角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        targetString = stc.killHankakuKatakana(targetString); // 半角カナを全角カナに変換

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }

    /**
     * 半角文字を全角に変換する（主に住所カナ）
     * @function toZenkakuAddress
     * @param target {string} 変換対象の項目名文字列
     */
    self.toZenkakuAddress = function(target){

        // 変数セット
        var strHyphen = '－'; // ハイフンは「全角ハイフン（文字コード: 65293）」を指定
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // プラグイン未対応の文字を個別に変換
        targetString = targetString.replace(/ｳﾞ/g, 'ヴ'); // 半角「ｳﾞ」を全角「ヴ(文字コード: 12532)」に変換
        targetString = targetString.replace(/ｯ/g, 'ッ'); // 半角「ｯ」を全角「ツ」に変換
        targetString = targetString.replace(/-/g, strHyphen); // 半角ハイフン(文字コード: 45)を全角ハイフンに変換
        targetString = targetString.replace(/ｰ/g, strHyphen); // 半角長音(文字コード: 65392)を全角ハイフンに変換
        targetString = targetString.replace(/ー/g, strHyphen); // 全角長音(文字コード: 12540)を全角ハイフンに変換

        // プラグイン機能にて半角を全角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        targetString = stc.autoConvert(targetString, {
            widthMode: 'toZenkaku', // 変換モードを半角->全角に設定
            kanaMode: false, // ひらがなをカタカナに変換はしない
            hankakuKatakanaMustDie: true, // 半角カタカナは全角カタカナに変換
            convert: {
                punctuation: true,  // カンマ、ピリオド、読点、句点を全角に変換
                tilda: false, // 半角「~」は変換しない
                exclamation: false, // 半角「!」は変換しない
                question: true,  // 半角「!」を全角「！」に変換
                space: true,  // 半角スペースを全角スペースに変換
                hyphen: true // 半角「-」「ｰ」をにzenkakuHyphenで指定した文字に変換
            },
            zenkakuHyphen: strHyphen, // 全角ハイフンの文字を指定
            zenkakuChilda: '〜'
        });

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }

    /**
     * 全角文字を半角に変換する（全ての文字種別）
     * @function toHankakuAll
     * @param target {string} 変換対象の項目名文字列
     */
    self.toHankakuAll = function(target){

        // 変数セット
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // プラグイン未対応の文字を個別に変換
        targetString = targetString.replace(/－/g, '-'); // 半角「ｳﾞ」を全角「ヴ(文字コード: 12532)」に変換

        // プラグイン機能にて半角を全角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        targetString = stc.autoConvert(targetString, {
            widthMode: 'toHankaku', // 変換モードを全角->半角に設定
            kanaMode: false, // ひらがなをカタカナに変換はしない
            hankakuKatakanaMustDie: false, // 半角カタカナは全角カタカナに変換
            convert: {
                punctuation: true,  // カンマ、ピリオド、読点、句点を半角に変換
                tilda: true, // 全角チルダ・波ダッシュを半角に変換
                exclamation: true, // 半角「!」をに変換
                question: true,  // 全角「！」を半角「!」に変換
                space: true,  // 全角スペースを半角スペースに変換
                hyphen: true // 全角ハイフン（－）・全角ダッシュ（―）・長音符（ー）・全角マイナス記号（−）を半角ハイフン（-）変換
            }
        });

        // プラグイン未対応の文字を個別に変換
        targetString = targetString.replace(/ｰ/g, '-'); // 半角長音を半角ハイフンに変換

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }

    /**
     * 全角整数を半角に変換する（整数のみ対象）
     * @function toHankakuInteger
     * @param target {string} 変換対象の項目名文字列
     */
    self.toHankakuInteger = function(target){

        // 変数セット
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // // 全角数字を半角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        if(targetString.match(/[０-９]+/)){    		// 全角数字の文字である場合
            targetString = stc.toHankaku(targetString); // プラグイン機能にて半角を全角に変換
        }

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }

    /**
     * 全角数字を半角に変換する（整数とピリオドのみ対象）
     * @function toHankakuNumber
     * @param target {string} 変換対象の項目名文字列
     */
    self.toHankakuNumber = function(target){

        // 変数セット
        var targetString = viewModel[target](); // 変換対象文字列
		if (!targetString) return;

        // // 全角数字を半角に変換
        var stc = $.SuperTextConverter(); // 半角変換用プラグインを変数化
        if(targetString.match(/[０-９．]+/)){    		// 全角数字または全角ピリオドの文字である場合

            // プラグイン機能にて全角を半角に変換
            targetString = stc.toHankaku(targetString, {
                convert: {
                    punctuation: true  // ピリオドを半角に変換
                }
            });
        }

        // ViewModelの項目に変換後文字列をセット
        viewModel[target](targetString);
    }
}