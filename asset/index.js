define(['zepto','oxjs'], function (undef,OXJS) {
    var //tpl='<div class="image-rect-fulllayer"><div class="image-box"></div></div>',
        RECT = 200,
        getFileData = function (file, fn) {
            var reader = new FileReader()
            reader.onload = function (e) {
                fn(e.target.result, file);

            }
            reader.readAsDataURL(file);
        };
    var bg_info = {};

    var im = document.createElement('canvas');
    im.className = 'mainimage';
    var $mainImg = $(im);
    var canvasContext = im.getContext('2d');
    var g_img;
    var $div;
    var placeImage = function () {
        if (!bg_info.src) {
            return
        }
        var s_w = $div.width(),
            s_h = $div.height();


        if (im.img_width >= im.img_height) {
            bg_info.width = Math.min(s_w, im.width);
            bg_info.height = im.height * bg_info.width / im.width;

        } else {

            bg_info.height = Math.min(s_h, im.height);
            bg_info.width = im.width * bg_info.height / im.height;
        }

        bg_info.scale = 1;
        bg_info.rotate = 0;
        bg_info.x = (s_w - bg_info.width) / 2;
        bg_info.y = (s_h - bg_info.height) / 2;

        //console.log('bg_info',bg_info)
        /*
         $div.css({
         'backgroundImage':'url('+bg_info.src+')',
         'backgroundSize':bg_info.width * bg_info.scale+'px '+bg_info.height * bg_info.scale+'px',
         'backgroundPosition':bg_info.x + 'px ' + bg_info.y + 'px'
         })
         */
        $mainImg.css({
            'width': bg_info.width * bg_info.scale + 'px',
            'height': bg_info.height * bg_info.scale + 'px',
            'left': bg_info.x + 'px ',
            'top': bg_info.y + 'px'
        })
    };

    return {
        init: function ($mod) {/**
            OXJS.exportFunction($mod,this,'render');
            OXJS.callFunction('wurui/image-rect','render',[src,'xxx']);
 */
            OXJS.exportFunction($mod,this,'render');
            var _this = this;
            var $trigger = $('.J_trigger', $mod);
            if ($trigger.length) {
                if ($trigger.attr('for')) {
                    console.log('[image-rect main.js]', 'ERROR', 'label initialized')
                    return false
                }
                var inputId = 'uploader' + Math.random().toString().substr(2, 8);

                $trigger.attr('for', inputId);
                var $file = $('<input type="file" style="position:fixed;top:-999px;left:-999px;" id="' + inputId + '"/>').appendTo('body')
                $file.on('change', function (e) {
                    getFileData(this.files[0], function (result) {
                        _this.render(result,function(base64){
                            var demoImage=new Image();
                            demoImage.src=base64;
                            $mod.append(demoImage);
                        })

                       //OXJS.callFunction('wurui/image-rect','render',[result,function(r){alert(r)}]);
                        $file.val('');
                    })
                });
            }

            $div = $('.J_fullLayer', $mod).on('gesturestart doubleTap', function (e) {
                e.preventDefault();
            });
            var $scale = $('.J_scale', $mod);

            var touch_pos = null;
            var scaleImage = function (deltaScale) {
                if (deltaScale) {

                    if (bg_info.scale < 0.2 && deltaScale < 0) {//反正不能太小,向上就不封顶了,会点得很累的
                        return
                    }
                    bg_info.scale += deltaScale;

                    bg_info.x -= bg_info.width * deltaScale / 2;
                    bg_info.y -= bg_info.height * deltaScale / 2;
                    $mainImg.addClass('transition').css({
                        'width': bg_info.width * bg_info.scale + 'px',
                        'height': bg_info.height * bg_info.scale + 'px',
                        'left': bg_info.x + 'px ',
                        'top': bg_info.y + 'px'
                    })

                    $scale.html(Math.round(bg_info.scale * 100) + '%');
                }
            };
            var rotateImage = function () {

                bg_info.rotate = (bg_info.rotate + 90) % 360;
                //$mainImg.css('transform','rotate('+bg_info.rotate+'deg)')

                canvasContext.clearRect(0, 0, im.width, im.height);//先清掉画布上的内容

                var x = im.width / 2; //画布宽度的一半
                var y = im.height / 2;//画布高度的一半

                var h = im.img_height, sx, sy;
                im.img_height = im.img_width;
                im.img_width = h;

                if (g_img.width >= g_img.height) {
                    sx = 0;
                    sy = (g_img.width - g_img.height) / 2;
                } else {
                    sy = 0;
                    sx = (g_img.height - g_img.width) / 2;
                }

                canvasContext.translate(x, y);//将绘图原点移到画布中点
                canvasContext.rotate((Math.PI / 180) * 90);
                canvasContext.translate(-x, -y);//将画布原点移动
                canvasContext.drawImage(g_img, sx, sy)

            };


            $(window).on('resize', placeImage);
            var last_gesture_scale = 1;

            $('.J_touchTigger').on('touchstart', function (e) {
                if (e.touches.length == 1) {
                    var touch = e.changedTouches[0];
                    touch_pos = {};
                    touch_pos.last_x = touch_pos.start_x = touch.clientX;
                    touch_pos.last_y = touch_pos.start_y = touch.clientY;
                    $mainImg.removeClass('transition');
                    e.preventDefault()

                } else {
                    touch_pos = null
                }
            }).on('touchmove', function (e) {
                if (touch_pos) {//console.log('moving')
                    var touch = e.changedTouches[0];

                    bg_info.x += touch.clientX - touch_pos.last_x
                    bg_info.y += touch.clientY - touch_pos.last_y


                    //$div.css('backgroundPosition',bg_info.x+'px '+bg_info.y+'px')
                    $mainImg.css({
                        'left': bg_info.x + 'px ',
                        'top': bg_info.y + 'px'
                    })

                    touch_pos.last_x = touch.clientX;
                    touch_pos.last_y = touch.clientY;
                }

            }).on('gesturestart', function (e) {
                e.preventDefault();
                last_gesture_scale = 1;
            }).on('gesturechange', function (e) {
                if (!touch_pos) {
                    var deltaScale = e.scale - last_gesture_scale;
                    scaleImage(deltaScale.toFixed(1) - 0)
                    last_gesture_scale = e.scale;
                    e.preventDefault();
                    return false
                }
            });
            var longtap_scale_to;
            $('.J_buttons').on('touchstart', function (e) {
                e.preventDefault()
                var tar = e.target,
                    role = tar.getAttribute('data-role'),
                    deltaScale = 0;
                switch (role) {
                    case 'plus':
                        deltaScale = 0.1;
                        break
                    case 'minus':
                        deltaScale = -0.1;
                        break
                    case 'rotate':
                        rotateImage();
                        return
                    default :
                        return
                }
                scaleImage(deltaScale);
                longtap_scale_to && clearInterval(longtap_scale_to);
                longtap_scale_to = setTimeout(function () {
                    longtap_scale_to && clearInterval(longtap_scale_to);
                    longtap_scale_to = setInterval(function () {
                        scaleImage(deltaScale);
                    }, 200)
                }, 800)


            }).on('touchmove touchend', function (e) {
                longtap_scale_to && clearInterval(longtap_scale_to)
                e.preventDefault()
            }).on('gesturestart doubleTap', function (e) {
                e.preventDefault()
            });
            $('.J_topButtons').on('click', function (e) {
                var tar = e.target,
                    role = tar.getAttribute('data-role');
                switch (role) {
                    case 'close':
                        $div.hide();
                        break
                    case 'ok':
                        var canvas = document.createElement('canvas');
                        canvas.width = canvas.height = RECT;
                        var ctx = canvas.getContext('2d');
                        var sx = ($div.width() - RECT) / 2 - bg_info.x,
                            sy = ($div.height() - RECT) / 2 - bg_info.y,
                            scalex = (bg_info.width * bg_info.scale) / im.width;
                        ctx.scale(scalex, scalex);
                        ctx.drawImage(im, -sx / scalex, -sy / scalex, im.width, im.height);
                        //
                        if (typeof _this.callback == 'function') {
                            _this.callback(canvas.toDataURL());
                        } else {

                        }
                        $div.hide();
                        break
                    default :
                        return
                }

            }).on('doubleTap', function (e) {
                e.preventDefault()
            });
        },
        render: function (src, fn) {
            var img = new Image;
            bg_info={};
            this.callback = fn;
            g_img = img;
            img.onload = function () {
                im.width = im.height = Math.max(img.width, img.height);
                im.img_width = img.width;
                im.img_height = img.height;
                var sx = 0, sy = 0;
                if (img.width >= img.height) {
                    sx = 0;
                    sy = (img.width - img.height) / 2;
                } else if (img.height > img.width) {
                    sy = 0;
                    sx = (img.height - img.width) / 2;
                }

                canvasContext.drawImage(img, sx, sy)
                placeImage();
            };
            img.src = bg_info.src = src;

            $div.show().prepend(im);
        }
    }
})
