/*
    Version 2.3.4
    The MIT License (MIT)

    Simple jQuery Slider is just what is says it is: a simple but powerfull jQuery slider.
    Copyright (c) 2014 Dirk Groenen - Bitlabs Development

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
*/
(function($){
    var simpleSlider = function(element, useroptions){
        // 设置一些变量
        var obj = this,
            sliderInterval = null;
        obj.currentSlide = 0;
        obj.totalSlides = 0;

        // 使用用户选项扩展默认选项
        useroptions = (useroptions === undefined) ? {} : useroptions;
        var options = $.extend({
            slidesContainer: element,
            slides: '.slide',
            slideTracker: true,
            slideTrackerID: 'slideposition',
            slideOnInterval: true,
            interval: 5000,
            swipe: true,
            animateDuration: 1000,
            animationEasing: 'ease',
            pauseOnHover: false,
            updateTransit: true // 改变这种错误的是你不想滑块更新交通usetransitionend真实
        }, useroptions);

        // 滑块
        obj.init = function(){
            // 如果交通包括usetransitionend = =假我们改变这个真实的（更好的动画效果）。
            // 除非用户改变updatetransit假
            if(options.updateTransit && $.support.transition && jQuery().transition && !$.transit.useTransitionEnd){
                $.transit.useTransitionEnd = true;
            }

            // 在sliderdom找到幻灯片和添加索引属性
            $(options.slidesContainer).find(options.slides).each(function(index){
                // Give each slide a data-index so we can control it later on
                $(this).attr('data-index', index);

                // IE左动画需要一个固定的宽度。这里我们给每个幻灯片一个宽度。               
                if ($.support.transition && jQuery().transition){
                    $(this).css({
                        x: index*100+'%',
                        width: $(this).outerWidth()
                    });
                }
                else{
                    $(this).css({
                        left: index*100+'%',
                        width: $(this).outerWidth()
                    });
                }
            });

            // 计算幻灯片总数
            obj.totalSlides = $(options.slidesContainer).find(options.slides).length;

            // 把slidetracker在容器如果启用的选项
            if(options.slideTracker){
                // 添加slideposition div添加指标
                $(options.slidesContainer).after("<div id='"+ options.slideTrackerID +"'><ul></ul></div>");
                for(var x = 0; x < obj.totalSlides;x++){
                    $('#'+ options.slideTrackerID +' ul').append('<li class="indicator" data-index="'+x+'"></li>');
                }
                $('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

                // 使滑动指示器可点击
                $("#"+ options.slideTrackerID +" ul li").click(function(){
                    if(!($(this).hasClass("active")))
                        obj.nextSlide($(this).data('index'));
                });
            }

            // 如果选项中启用，则开始滑块间隔。
            if(options.slideOnInterval){
                setSliderInterval();
            }

            // 与掠夺之手，模拟刷卡的台式机改变光标
            if(options.swipe && jQuery().swipe){
                $(options.slidesContainer).css('cursor','-webkit-grab');
                $(options.slidesContainer).css('cursor','-moz-grab');
                $(options.slidesContainer).css('cursor','grab');

                $(options.slidesContainer).mousedown(function(){
                    $(options.slidesContainer).css('cursor','-webkit-grabbing');
                    $(options.slidesContainer).css('cursor','-moz-grabbing');
                    $(options.slidesContainer).css('cursor','grabbing');
                });

                $(options.slidesContainer).mouseup(function(){
                    $(options.slidesContainer).css('cursor','-webkit-grab');
                    $(options.slidesContainer).css('cursor','-moz-grab');
                    $(options.slidesContainer).css('cursor','grab');
                });

                // 向容器中添加刷卡操作。
                $(options.slidesContainer).swipe({
                    swipeLeft: function(){
                        obj.nextSlide();
                    },
                    swipeRight: function(){
                        obj.prevSlide();
                    }
                });
            }
            else if(!jQuery().swipe && options.swipe === true){
                console.warn("Duo the missing TouchSwipe.js swipe has been disabled.");
            }
        }();

        // 绑定的功能，重新计算在每个幻灯片的宽度调整。
        $(window).resize(function(){
            $(options.slidesContainer).find(options.slides).each(function(index){
                // 重置宽度，否则将保持与以前相同的宽度。
                $(this).css('width','');
                $(this).css({x: index*100+'%',width: $(this).outerWidth()});
            });
        });

        // 区间控制器
        function setSliderInterval(){
            clearInterval(sliderInterval);
            sliderInterval = setInterval(function(){
                obj.nextSlide();
            },options.interval);
        };

        // 去一个以前的幻灯片（调用新的幻灯片数nextslide功能)
        obj.prevSlide = function(){
            var slide = (obj.currentSlide > 0) ? obj.currentSlide -= 1 : (obj.totalSlides - 1);
            obj.nextSlide(slide);
        };

        // 转到下一个幻灯片（函数也用于前面的幻灯片并转到幻灯片功能）。
        // 如果一个参数是将给定的幻灯片
        obj.nextSlide = function(slide){
            // 以前的幻灯片编号和设置缓存按假
            var prevSlide = obj.currentSlide,
                slided = false;

            if(slide === undefined)
                obj.currentSlide = (obj.currentSlide < (obj.totalSlides-1)) ? obj.currentSlide += 1 : 0 ;
            else
                obj.currentSlide = slide;

            // 在幻灯片幻灯片之前创建触发点。触发器将返回prev和幻灯片编号
            $(element).trigger({
                type: "beforeSliding",
                prevSlide: prevSlide,
                newSlide: obj.currentSlide
            });

            // 幻灯片动画，在这里我们决定是否可以使用CSS转换（滚动），或者使用jQuery动画。
            $(options.slidesContainer).find(options.slides).each(function(index){
                if ($.support.transition && jQuery().transition)
                    $(this).stop().transition({x: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration, options.animationEasing);
                else
                    $(this).stop().animate({left: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration, triggerSlideEnd);
            });

            // 不知怎么的，$转换的回调不起作用，所以我们在这里创建自定义绑定
            $(options.slidesContainer).on('oTransitionEnd webkitTransitionEnd oTransitionEnd otransitionend transitionend', triggerSlideEnd);

            // 创建幻灯片幻灯片后的触发点。所有的幻灯片返回transitionend；防止重复触发我们保持滑动VaR=r
            function triggerSlideEnd(){
                if(!slided){
                    $(element).trigger({
                        type: "afterSliding",
                        prevSlide: prevSlide,
                        newSlide: obj.currentSlide
                    });
                    slided = true;
                }
            }

            // 显示当前幻灯片
            $('#'+ options.slideTrackerID +' ul li').removeClass('active');
            $('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

            // 设置滑块间隔
            if(options.slideOnInterval){
                setSliderInterval();
            }
        };

        // 在pauseonhover函数。
        //函数将清除间隔，并在鼠标从容器中消失后重新启动它。
        if(options.pauseOnHover){
            $(options.slidesContainer).hover(function(){
                clearInterval(sliderInterval);
            }, function(){
                setSliderInterval();
            });
        }
    };

    // 创建一个插件
    $.fn.simpleSlider = function(options){
        return this.each(function(){
            var element = $(this);

            // 如果这个元素已经有一个插件实例，请尽早返回
            if (element.data('simpleslider')) return;

            // 通过选择和元素的插件结构
            var simpleslider = new simpleSlider(this, options);

            // 将插件对象存储在这个元素的数据中
            element.data('simpleslider', simpleslider);
        });
    }
})(jQuery);
