/****			このコメントを削除しないで下さい。
@package		flex-font-layout.js
@version		2.0.1
@license		商用以外でのご利用は無料です。詳しくは https://flex-font.com/license をご覧ください。※このスクリプトは著作権で守られています。

[商用利用ライセンスコード：未登録]

ターゲット要素のサイズに合わせてfont-sizeを無段階に変更する、flexfontレイアウト用マルチデバイス対応JavaScriptです。
画像ベースのランディングページ等で、画像上にテキストを重ねて表示したい場合などにご利用ください。

使用方法		https://flex-font.com/how_to/
****/


/////////////////////////////////////////////////////////////////////////
// ■<style>で文字を一旦非表示
if (document.getElementById('ff__temp_style') == null) {
  var t1 = document.getElementsByTagName('head')[0];
  t1.insertAdjacentHTML('afterbegin', "<style id='ff__temp_style'> .ff, .ff0, .ff1, .ff2, .ff3, .ff4, .ff5, .ff6, .ff7, .ff8, .ff9{ visibility: hidden; } .ff_temp{ visibility: unset !important; }</style>");

}

/////////////////////////////////////////////////////////////////////////
// ■画像を読み込みながら、文字サイズを変更して表示
(function () { // htmlロード時の処理
  var processEvent = function (e) {
    if (e.currentTarget != undefined) {
      ff(e.currentTarget); // 文字サイズを変更して表示
    }
  }

  var i;
  var obj = document.getElementsByTagName('img');
  for (i = 0; i < obj.length; i++) {
    if (document.defaultView.getComputedStyle(obj[i], null).display) {
      continue;
    } else {
      obj[i].src_copy = obj[i].src;
      obj[i].src = ''; // 一旦クリア
      obj[i].addEventListener('load', processEvent);
      obj[i].src = obj[i].src_copy; // 画像読み込み開始
      var rect = obj[i].getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var offsetTop = rect.top + scrollTop;
      if (window.innerHeight <= offsetTop) {
        break;
      }
    }
  }
}());


/////////////////////////////////////////////////////////////////////////
// ■文字サイズを変更して表示
var browser_min_f_size; // 使用中のブラウザの最小font-size
var ff = function (target_img) {

  var t_ary;
  if (target_img != null) {
    t_ary = target_img.parentNode.querySelectorAll('.ff, .ff0, .ff1, .ff2, .ff3, .ff4, .ff5, .ff6, .ff7, .ff8, .ff9');

  } else {
    t_ary = document.querySelectorAll('.ff, .ff0, .ff1, .ff2, .ff3, .ff4, .ff5, .ff6, .ff7, .ff8, .ff9');
  }

  var f_hash = [];
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
        if (target) {
          width = target.clientWidth;
          data_w_ff = target.getAttribute('data-w-' + c_ary[i]);
        }
      }
    }
    //③ ターゲット要素が非表示なら return
    if (target == null || target.style.display == 'none') {
      return;
    }
    //④ 文字サイズ[px]を設定
    var efs;
    if (x_this.getAttribute('data-fs')) {
      efs = x_this.getAttribute('data-fs');
    }
    if (isFinite(width) && isFinite(data_w_ff) && isFinite(efs)) {
      var f_size = width * efs / data_w_ff;
      // 最小font-sizeの規制があるブラウザは scale を設定
      if (isFinite(f_size)) {
        if (f_size < 10) {
          // 最小font-size browser_min_f_size を設定
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
              x_this.style.transform = '';
            }
          }

        }
      }
      // iOS11以下対応
      if (navigator.platform.match(/iPhone|iPad|iPod/)) {
        while (f_size <= 9999) {
          if (f_hash[f_size] != 1) {
            f_hash[f_size] = 1;
            break;
          } else {
            f_size += 0.0001;
          }
        }
      }
      // 文字サイズ[px]を設定
      if (isFinite(f_size)) {
        if (target_img != null) {
          x_this.classList.add('ff_temp'); // .ff_temp を追加して、要素を一旦非表示
        } else {
          if (x_this.classList.contains('ff_temp')) { // .ff_temp を削除して、要素を再表示
            x_this.classList.remove('ff_temp');
          }
        }
        x_this.style.fontSize = f_size + 'px';
      }
    }
  });
};


/////////////////////////////////////////////////////////////////////////
// ■画像などが表示された後と、画面サイズが変わった時の処理
window.addEventListener('load', function () {
  // 不要になった <style> と .ff_temp を削除
  if (document.getElementById('ff__temp_style')) {
    var c1 = document.getElementById("ff__temp_style");
    c1.parentNode.removeChild(c1);
  }
  var elems = document.getElementsByClassName('ff_temp');
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.remove('ff_temp');
  }
  // 文字サイズを変更して表示
  ff();
}, false);

window.addEventListener('resize', function () {
  // 不要になった <style> と .ff_temp を削除
  if (document.getElementById('ff__temp_style')) {
    var c1 = document.getElementById("ff__temp_style");
    c1.parentNode.removeChild(c1);
  }
  var elems = document.getElementsByClassName('ff_temp');
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.remove('ff_temp');
  }
  // 文字サイズを変更して表示
  ff();
}, false);
