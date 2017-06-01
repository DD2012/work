define(['jquery'], function($) {
    return function() {
        var that = this;
        var _func = {
            // left nav shrink 收缩
            shrink: function() {
                $('.nav-li').addClass('live-hover');
                $('.foldingpad').addClass('rotate');
                $('.page-container').css('margin-left', '0');
                $('.page-sidebar').css('margin-left', '-200px');
                $('.page-small-sidebar').css('margin-left', '0px');
                $('.global-notice').css('left', '90px')
            },
            // left nav unfold 展开
            unfold: function() {
                $('.nav-li').removeClass('live-hover');
                $('.foldingpad').removeClass('rotate');
                $('.page-container').css('margin-left', '78px');
                $('.page-sidebar').css('margin-left', '0px');
                $('.page-small-sidebar').css('margin-left', '-55px');
                $('.global-notice').css('left', '235px');
            }
        }
        //切换slideBar
        $('.foldingpad').click(function() {
            if ($(this).hasClass('rotate')) {
                _func.unfold(); //展开
            } else {
                _func.shrink();
            }
        });


    }
});
