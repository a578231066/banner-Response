var mainslider;

$(document).ready(function(){
    var options = {
        slides: '.slide', // 在slidescontainer幻灯片的名称
        swipe: true,    // 添加可能刷卡>注意你必须包括touchswipe这
        slideTracker: true, // 添加带有列表项的UL以跟踪当前幻灯片
        slideTrackerID: 'slideposition', // 跟踪幻灯片的UL的名称
        slideOnInterval: false, // 滑动区间
        interval: 9000, // 区间上滑动，如果slideoninterval启用
        animateDuration: 1000, // 动画持续时间
        animationEasing: 'ease', 
        pauseOnHover: false // 当用户悬停在滑动容器时暂停
    };

    $(".slider").simpleSlider(options);
    mainslider = $(".slider").data("simpleslider");
    /* 是的，就这些! */

    $(".slider").on("beforeSliding", function(event){
        var prevSlide = event.prevSlide;
        var newSlide = event.newSlide;
        $(".slider .slide[data-index='"+prevSlide+"'] .slidecontent").fadeOut();
        $(".slider .slide[data-index='"+newSlide+"'] .slidecontent").hide();
    });

    $(".slider").on("afterSliding", function(event){
        var prevSlide = event.prevSlide;
        var newSlide = event.newSlide;
        $(".slider .slide[data-index='"+newSlide+"'] .slidecontent").fadeIn();
    });

    $(".slide#first").backstretch("images/bg1.jpg");
    $(".slide#sec").backstretch("images/bg2.jpg");
    $(".slide#thirth").backstretch("images/bg4.jpg");
    $(".slide#fourth").backstretch("images/bg5.jpg");

    $('.slide .backstretch img').on('dragstart', function(event) { event.preventDefault(); });

    $(".slidecontent").each(function(){
        $(this).css('margin-top', -$(this).height()/2);
    });
});
