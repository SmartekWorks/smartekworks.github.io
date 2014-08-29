(function (w) {
'use strict';

// -------------------------------------------------
// 媒体コードの引き継ぎ
// -------------------------------------------------

//現在の設定：「このソースが読み込まれているページの自ドメイン内へのリンクにキーラインを引き継ぐ」
//14行目のプロパティを変更することで設定変更できます。

//引き継ぎ条件リスト
var pathList = {
    //自ドメイン内へのリンクすべてに対して
    INHERIT : /^\//,
    //引き継ぎ除外条件
    FILTER : [

    ],
    HASH : '#',
    PARAM : /\?/
};

//内部利用値
var loc = w.location;
var doc = w.document;

// 媒体コード抽出
var getKeyline = function () {
    var okl = loc.search.match(/[\?&]oKL?=([0-9a-zA-Z]{1,7})/);
    return okl && okl[1] ? okl[1] : '';
};
var keyline = getKeyline();

keyline && (function () {
    //判別に用いる汎用的な関数
    var createNewHref = function (hrefStr) {
        var paramName = 'oKL=';
        var params, hash, ret;

        //既にkeylineを持っている場合 || ページ内リンクの場合
        if (hrefStr.match(/\oKL=/) ||　hrefStr.match(/^#/)) {
            return;
        }

        //引き継ぎ除外リストが登録されている場合の照合
        if (pathList.FILTER[0]) {
            var filterLen = pathList.FILTER.length;
            var i;

            for (i = 0; i < filterLen; i++) {
                if (hrefStr.match(pathList.FILTER[i])) {
                    return;
                }
            }
        }

        //別ドメインへの遷移は除外
        if (hrefStr.match(/http/) || !hrefStr.match(pathList.INHERIT) ) {
            return;
        }

        params = hrefStr.match(pathList.PARAM);
        hash   = hrefStr.match(pathList.HASH);

        //引き継ぎ処理
        if (hash) {
            if (params) {
                //ハッシュとパラメーター
                ret = hrefStr.replace(/(#.+$)/, '&' + paramName + keyline + '$1');
            } else {
                //hashのみ
                ret = hrefStr.replace(/(#.+$)/, '?' + paramName + keyline + '$1');
            }
        } else if (params) {
            //パラメーターのみ
            ret = hrefStr + '&' + paramName + keyline;
        } else {
            //通常
            paramName = '?' + paramName;

            if (hrefStr.match(/(mypage|request-doc)$/) && !hash) {
                //href属性の末尾に不備があった場合、追加する処理を行う
                //mypageとrequest-docのみ確認
                paramName = '/' + paramName;
            }

            ret = hrefStr + paramName + keyline;
        }

        return ret;
    };

    'jQuery' in w ? $(function () {
        //jQueryが存在する場合
        $('a').bind('click', function () {
            var $this = $(this);
            var hrefStr = $this.attr('href');
            var newStr;

            newStr = createNewHref(hrefStr);

            if (newStr) {
                $this.attr('href', newStr);
            }
        });
    }) : (function () {
        //jQueryが存在しない場合
        var addEvent = function (elem, type, listener) {
            if (w.addEventListener) {
                elem.addEventListener(type, listener, false);
            } else if (w.attachEvent) {
                elem.attachEvent('on' + type, listener);
            }
        };
        var getAnchorElement = function (e) {
            var el = e.target || e.srcElement || null;

            if (!el) {
                return;
            }

            while (el.tagName !== 'A') {
                el = el.parentNode;
            }

            return el;
        };
        //click時に実行
        var addKeyline = function (e) {
            var elem = getAnchorElement(e);
            var hrefStr = elem.href;
            var domain = loc.protocol + '//' + loc.hostname;
            var newStr;

            // domainを消去しjQueryでのattr取得時との差異がないようにする
            hrefStr = hrefStr.replace(domain, '');

            newStr = createNewHref(hrefStr);

            if (newStr) {
                elem.href = newStr;
            }
        };

        addEvent(w, 'load', function () {
            var ancs = doc.getElementsByTagName('a');
            var ancsLen = ancs.length;
            var i;

            for (i = 0; i < ancsLen; i++) {
                addEvent(ancs[i], 'click', addKeyline);
            }

        });
    }());
}());

}(window));