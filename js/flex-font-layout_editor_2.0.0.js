/****			このコメントを削除しないで下さい。
@package		flex-font-layout_editor.js
@version		2.0.0
@license		商用以外でのご利用は無料です。詳しくは https://flex-font.com/license をご覧ください。※このスクリプトは著作権で守られています。

[商用利用ライセンスコード：未登録]

flex-font-layout.jsの編集用JavaScriptです。
Google Chromeデベロッパーツール等のブラウザのコード編集機能を利用して、HTML要素の style を編集します。

使用方法		https://flex-font.com/how_to/
****/


/////////////////////////////////////////////////////////////////////////
// ■flexfontレイアウト編集モード
window.addEventListener('load', function () { // ページ全体が読み込まれた時の処理
  if (document.getElementsByClassName('ff_edit_mode').length) {
    var browser_min_f_size; // 使用中のブラウザの最小フォントサイズ
    var remove_ff_temp; // 不要になった <style> と .ff_temp を削除済みか
    setInterval(function () {
      // 不要になった <style> と .ff_temp を削除
      if (remove_ff_temp != 1) {
        if (document.getElementById('ff__temp_style')) {
          var c1 = document.getElementById("ff__temp_style");
          c1.parentNode.removeChild(c1);
        }
        var elems = document.getElementsByClassName('ff_temp');
        for (var i = 0; i < elems.length; i++) {
          elems[i].classList.remove('ff_temp');
        }
        remove_ff_temp = 1;
      }

      var t_ary = document.querySelectorAll('.ff, .ff0, .ff1, .ff2, .ff3, .ff4, .ff5, .ff6, .ff7, .ff8, .ff9');
      var t_ary2 = Array.prototype.slice.call(t_ary, 0);
      t_ary2.forEach(function (x_this) {
        //① 対象要素が非表示なら return
        if (x_this.style.display == 'none') {
          return;
        }
        //② ターゲット（基準となる要素）の現在の幅 width と、基準幅 data_w_ff を取得
        var target, width, data_w_ff;
        var c_ary = x_this.getAttribute('class').split(' ');
        for (i = 0; i < c_ary.length; i++) {
          if (c_ary[i].match(/^ff[0-9]?$/)) {
            target = document.querySelector('*[data-w-' + c_ary[i] + ']');
            width = target.clientWidth;
            data_w_ff = target.getAttribute('data-w-' + c_ary[i]);
          }
        }
        //③ ターゲット要素が非表示なら return
        if (target.style.display == 'none') {
          return;
        }
        //④ 基準文字サイズ data-fs を設定
        var f_size = x_this.style.fontSize.replace('px', '');
        if (f_size === '') {
          f_size = 15; // 初期値
          x_this.style.fontSize = f_size + 'px';
        }
        if (isFinite(width) && isFinite(data_w_ff) && isFinite(f_size)) {
          var efs = data_w_ff * f_size / width;
          if (isFinite(efs)) {
            x_this.setAttribute('data-fs', efs);
          }
        }
        //⑤ 最小フォントサイズの規制があるブラウザは scale を設定
        if (isFinite(f_size)) {
          // 最小フォントサイズ browser_min_f_size を調べる
          if (browser_min_f_size == undefined) {
            for (var i = 10; i >= 1; i--) {
              var body = document.getElementsByTagName('body')[0];
              body.insertAdjacentHTML('beforeend', '<span id="ff__scale_temp_0" style="font-size:' + i + 'px; visibility:hidden;">flex-font.com</span>');
              body.insertAdjacentHTML('beforeend', '<span id="ff__scale_temp_1" style="font-size:' + (i - 1) + 'px; visibility:hidden;">flex-font.com</span>');

              if (document.getElementById('ff__scale_temp_0').style.width == document.getElementById('ff__scale_temp_1').style.width) {
                browser_min_f_size = i;
                body.removeChild(document.getElementById('ff__scale_temp_0'));
                body.removeChild(document.getElementById('ff__scale_temp_1'));
                break;
              }
              body.removeChild(document.getElementById('ff__scale_temp_0'));
              body.removeChild(document.getElementById('ff__scale_temp_1'));
            }
          }
          // scaleを設定
          if (isFinite(browser_min_f_size) && f_size < browser_min_f_size) {
            x_this.setAttribute('data-browser_min_f_size', browser_min_f_size);
            x_this.style.transform = 'scale(' + (f_size / browser_min_f_size) + ')';
          } else {
            if (isFinite(x_this.getAttribute('data-browser_min_f_size'))) {
              x_this.removeAttribute('data-browser_min_f_size');
              var style = x_this.getAttribute('style').replace(/ transform: scale\(.+?\);/, '');
              x_this.setAttribute('style', style);
            }
          }

        }
        //⑥ top と left の初期値を設定
        if (x_this.style.position == 'absolute') {
          if (x_this.getAttribute('style').match(/(^|;) *(top|bottom) *:/) == null) {
            x_this.style.top = '0%';
          }
          if (x_this.getAttribute('style').match(/(^|;) *(left|right) *:/) == null) {
            x_this.style.left = '0%';
          }
        }
      });
    }, 500);
  }
});
