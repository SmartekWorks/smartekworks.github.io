/**
 * シミュレーション画面のstyleに関係する処理
 * @class simulation.style
 * @constructor
 */
$(function(){

	/**
	 * 「みなさんの加入傾向」ボタン押下時、または
	 * 「保険料払込期間」リンク押下時、または
	 * 「（ブリッジ）詳しくはこちら」リンク押下時、または
	 * 「（キープ）支払保証期間」リンク押下時、または
	 * 「（キープ）一括受取」リンク押下時、または
	 * 「（キープ）お申込みいただけるプラン」リンク押下時に開く、
	 *  ポップアップウインドウの横幅（700）・縦幅（650）、メニューバーの非表示、ツールバーの非表示、スクロールバーの表示を制御する。
	 * @method $('a[rel="external"]').click
	 * @return {boolean} 常にfalseを返す。
	 */
	$('a[rel="external"]').click(function(){
		window.open(this.href, 'newWindow', 'width=700, height=650, menubar=no, toolbar=no, scrollbars=yes');
		return false;
	});


	/**
	 * （全商品では対象クラス無し）
	 * 内容は、ポップアップウインドウの横幅（800）・縦幅（650）、メニューバーの非表示、ツールバーの非表示、スクロールバーの表示を制御する。
	 * @method $('a[rel="externalW"]').click
	 * @return {boolean} 常にfalseを返す。
	 */
	$('a[rel="externalW"]').click(function(){
		window.open(this.href, 'newWindow2', 'width=800, height=650, menubar=no, toolbar=no, scrollbars=yes');
		return false;
	});


	/**
	 * （全商品では対象クラス無し）
	 * @method birthdayalert01()
	 * @return {boolean} 常にfalseを返す。
	 */
	function birthdayalert01() {
		$(function(){
			$('.user-status').prepend('');
			return false;
		});
	}


	/**
	 * （全商品では対象クラス無し）
	 * シミュレーション結果を保存するのエラー表示をクリックしたとき
	 * @method $(".pop-box000-save").click
	 */
	$(".pop-box000-save").click(
		function(){
			$(".pop-box000-save").hide();
		}
	);


	/**
	 * マイページにログイン状態で、会員ステータスが「"10"（Myページ作成）」以外の場合に表示されるフキダシ
	 * 「マイページにログインされている状態のため、ご登録いただいているお客さま情報を表示しています。」
	 * をクリックしたときに、フキダシを非表示にさせる処理。
	 * @method $(".pop-box005").click
	 */
	$(".pop-box005").click(
		function(){
			$(".pop-box005").hide();
		}
	);


	/**
	 * シミュレーション画面では未使用。保険プランのご確認画面で使用。
	 * 契約者の誕生日が、90日以内の場合に表示されるフキダシ
	 * 「お誕生日が近い方はご注意ください」
	 * をクリックしたときに、フキダシを非表示にさせる処理。
	 * @method $(".age-caution").click
	 */
	$(".age-caution").click(
		function(){
			$(".age-caution").hide();
		}
	);


	/**
	 * おすすめ4商品で、「月払に変更/年払に変更」の「？」にカーソルをあてたとき、フキダシを表示する。
	 * 「月払に変更/年払に変更」の「？」からカーソルがはずれたとき、フキダシを非表示にする。
	 * @method $(".pop003 a").hover
	 */
	$(".pop003 a").hover(
		function(){
			$(".age-caution").show();
		},
		function(){
			$(".age-caution").hide();
		}
	);


	/**
	 * おすすめ4商品で、入院給付金日額の合計が10,000円を超えた場合に表示される
	 * 「（新キュア）入院給付金日額」の「！」にカーソルをあてたとき、フキダシを表示する。
	 * 「（新キュア）入院給付金日額」の「！」からカーソルがはずれたとき、フキダシを非表示にする。
	 * @method $(".pop40").hover
	 */
	$(".pop40").hover(
		function(){
			$(".pop-box40").show();
		},
		function(){
			$(".pop-box40").hide();
		}
	);


	/**
	 * おすすめ4商品で、入院給付金日額の合計が10,000円を超えた場合に表示される
	 * 「（新キュア・レディ）入院給付金日額」の「！」にカーソルをあてたとき、フキダシを表示する。
	 * 「（新キュア・レディ）入院給付金日額」の「！」からカーソルがはずれたとき、フキダシを非表示にする。
	 * @method $(".pop50").hover
	 */
	$(".pop50").hover(
		function(){
			$(".pop-box50").show();
		},
		function(){
			$(".pop-box50").hide();
		}
	);


	/**
	 * 角を丸くする属性が使えるか判定し、使えるならば角を丸くする制御を行う。
	 * @method $(document).ready
	 */
	if (!($.support.borderRadius)) {
		$(".icon-pc").corner("20px");
		$(".icon-letter").corner("20px");
		$("#age-setting").corner("20px");
		$(".set-inner").corner("15px");
		$(".change_btn").corner("5px");
		$(".change_btn a").corner("3px");
		$(".user-status").corner("5px");
		$(".user-status-inner").corner("3px");
		$(".list-help li").corner("5px");
		$(".list-help li a").corner("3px");
	}

});

/**
 * シミュレーション画面のstyleに関係するオブジェクト
 * @class SimulationStyle
 * @constructor
 */
var SimulationStyle = function() {
	var self = this;

	/**
	 * 「年齢・性別を変更する」ボタンを押下したときに、生年月日・性別入力ダイアログ以外を白くする。
	 * @method showAgeSetting
	 */
	self.showAgeSetting = function(){
		$(".bk_bg").show();	// 背景を白く
		$("#age-setting").fadeIn(500);	// ダイアログをフェードイン
	}


	/**
	 * 一定条件によって表示されるフキダシをクリックしたときに、フキダシを非表示にさせる処理。
	 * @method hideSelf
	 * @param data {Object} 現在のビューモデル
	 * @param event {jQuery.Event} DOMイベントオブジェクト
	 */
	 self.hideSelf = function(data, event){
	 	$(event.currentTarget).hide();
	 }


	/**
	 * 「おすすめポイント」にカーソルをあてたとき、フキダシを表示する。
	 * @method btnPointOver
	 * @param data {Object} 現在のビューモデル
	 * @param event {jQuery.Event} DOMイベントオブジェクト
	 */
	self.btnPointOver = function(data, event) {
		$(event.currentTarget).next(".pop-box").show();
	}


	/**
	 * 「おすすめポイント」からカーソルがはずれたとき、フキダシを非表示にする。
	 * @method btnPointOut
	 * @param data {Object} 現在のビューモデル
	 * @param event {jQuery.Event} DOMイベントオブジェクト
	 */
	self.btnPointOut = function(data, event) {
		$(event.currentTarget).next(".pop-box").hide();
	}


	/**
	 * simul-box内の「？」にカーソルをあてたとき、フキダシを表示する。
	 * @method quesOver
	 * @param data {Object} 現在のビューモデル
	 * @param event {jQuery.Event} DOMイベントオブジェクト
	 */
	self.quesOver = function(data, event) {
		var target = "#" + event.currentTarget.id + "-box";
		$(target).show();
	}


	/**
	 * simul-box内の「？」からカーソルがはずれたとき、フキダシを非表示にする。
	 * @method quesOut
	 * @param data {Object} 現在のビューモデル
	 * @param event {jQuery.Event} DOMイベントオブジェクト
	 */
	self.quesOut = function(data, event) {
		var target = "#" + event.currentTarget.id + "-box";
		$(target).hide();
	}

}
