$(function(){

    $('.top-link').click(function() {
        var id = $(this).attr('href');
        var position = $(id).offset().top;
        $('html, body').animate({'scrollTop':position},500);
      });


    $(function(){
        var winScrollTop;
        $('.js-modal-open').each(function(){
            $(this).on('click',function(){
                //スクロール位置を取得
                winScrollTop = $(window).scrollTop();
                var target = $(this).data('target');
                var modal = document.getElementById(target);
                $(modal).fadeIn();
                return false;
            });
        });
        $('.js-modal-close').on('click',function(){
            $('.js-modal').fadeOut();
            $('body,html').stop().animate({scrollTop:winScrollTop}, 100);
            return false;
        }); 
    });


    function toggleNav() {
        var body = document.body;
        var hamburger = document.getElementById('js-hamburger');
        var blackBg = document.getElementById('js-black-bg');
        var navhome = document.getElementById('nav-home');
        var navnews = document.getElementById('nav-news');
        var navlineup = document.getElementById('nav-lineup');
        var navabout = document.getElementById('nav-about');
        var navcontact = document.getElementById('nav-contact');

      
        hamburger.addEventListener('click', function() {
          body.classList.toggle('nav-open');
        });
        blackBg.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        navhome.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        navnews.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        navlineup.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        navabout.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        navcontact.addEventListener('click', function() {
          body.classList.remove('nav-open');
        });
        
      }
      toggleNav();

    


});
