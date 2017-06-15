define([],function(){
    var tpl='<div class="image-rect-fulllayer"><div class="image-box"></div></div>',
        RECT=200,
        getFileData=function(file,fn){
            var reader = new FileReader()
            reader.onload = function (e) {
                fn(e.target.result, file);

            }
            reader.readAsDataURL(file);
        };
  return {
    init:function($trigger){
        if($trigger.attr('for')){
            console.log('[image-rect main.js]','ERROR','label initialized')
            return false
        }
        var $div=$('.J_fullLayer'),
            $scale=$('.J_scale');

        var inputId='uploader'+Math.random().toString().substr(2,8);
        var bg_info={

        };

        var im=document.createElement('canvas');
        im.className='mainimage';
        var $mainImg=$(im);
        var canvasContext=im.getContext('2d');
        var g_img;

        $trigger.attr('for',inputId);
        var $file=$('<input type="file" style="position:fixed;top:-999px;left:-999px;" id="'+inputId+'"/>').appendTo('body')
        $file.on('change',function(e){
            getFileData(this.files[0],function(result){
                var img=new Image;
                g_img=img;
                img.onload = function(){
                    im.width=im.height=Math.max(img.width,img.height);
                    im.img_width=img.width;
                    im.img_height=img.height;
                    var sx= 0,sy=0;
                    if(img.width>=img.height){
                        sx=0;
                        sy=(img.width-img.height)/2;
                    }else if(img.height>img.width){
                        sy=0;
                        sx=(img.height-img.width)/2;
                    }

                    canvasContext.drawImage(img,sx,sy)
                    placeImage();
                };
                img.src=bg_info.src=result;

                $div.show().prepend(im);
                $file.val('');

            })
        });


        var touch_pos=null;



        var scaleImage=function(deltaScale){
            if(deltaScale) {

                if(bg_info.scale<0.2　&& deltaScale<0){//反正不能太小,向上就不封顶了,会点得很累的
                    return
                }
                bg_info.scale+=deltaScale;

                bg_info.x -= bg_info.width * deltaScale / 2;
                bg_info.y -= bg_info.height * deltaScale / 2;
                $mainImg.addClass('transition').css({
                    'width':bg_info.width * bg_info.scale+'px',
                    'height':bg_info.height * bg_info.scale+'px',
                    'left':bg_info.x + 'px ',
                    'top':bg_info.y + 'px'
                })

                $scale.html(Math.round(bg_info.scale*100)+'%');
            }
        };
        var rotateImage=function(){

            bg_info.rotate=(bg_info.rotate+90)%360;
            //$mainImg.css('transform','rotate('+bg_info.rotate+'deg)')

            canvasContext.clearRect(0,0,  im.width,im.height);//先清掉画布上的内容

            var x = im.width/2; //画布宽度的一半
            var y = im.height/2;//画布高度的一半

            var h=im.img_height,sx,sy;
            im.img_height=im.img_width;
            im.img_width=h;

            if(im.img_width>=im.img_height){
                sx=0;
                sy=(im.img_width-im.img_height)/2;
            }else if(im.img_height>im.img_width){
                sy=0;
                sx=(im.img_height-im.img_width)/2;
            }


            canvasContext.translate(x,y);//将绘图原点移到画布中点


            canvasContext.rotate((Math.PI / 180) * 90);

            canvasContext.translate(-y,-x);//将画布原点移动


            canvasContext.drawImage(g_img,sx,sy)




        };
        var placeImage=function(){
            if(!bg_info.src){
                return
            }
            var s_w=$div.width(),
                s_h=$div.height();


            if(im.img_width>=im.img_height){
                bg_info.width=Math.min(s_w,im.width);
                bg_info.height=im.height * bg_info.width/im.width;

            }else{

                bg_info.height=Math.min(s_h,im.height);
                bg_info.width=im.width * bg_info.height/im.height;
            }

            bg_info.scale=1;
            bg_info.rotate=0;
            bg_info.x= (s_w - bg_info.width)/2;
            bg_info.y= (s_h - bg_info.height)/2;

            //console.log('bg_info',bg_info)
            /*
            $div.css({
                'backgroundImage':'url('+bg_info.src+')',
                'backgroundSize':bg_info.width * bg_info.scale+'px '+bg_info.height * bg_info.scale+'px',
                'backgroundPosition':bg_info.x + 'px ' + bg_info.y + 'px'
            })
            */
            $mainImg.css({
                'width':bg_info.width * bg_info.scale+'px',
                'height':bg_info.height * bg_info.scale+'px',
                'left':bg_info.x + 'px ' ,
                'top':bg_info.y + 'px'
            })
        };

        $(window).on('resize',placeImage);
        var last_gesture_scale=1;

        $('.J_touchTigger').on('touchstart',function(e){
            if(e.touches.length==1){
                var touch= e.changedTouches[0];
                touch_pos={};
                touch_pos.last_x=touch_pos.start_x=touch.clientX;
                touch_pos.last_y=touch_pos.start_y=touch.clientY;
                $mainImg.removeClass('transition')

            }else{
                touch_pos=null
            }
        }).on('touchmove',function(e){
            if(touch_pos){//console.log('moving')
                var touch= e.changedTouches[0];

                bg_info.x+= touch.clientX - touch_pos.last_x
                bg_info.y+= touch.clientY - touch_pos.last_y


                //$div.css('backgroundPosition',bg_info.x+'px '+bg_info.y+'px')
                $mainImg.css({
                    'left':bg_info.x + 'px ' ,
                    'top':bg_info.y + 'px'
                })

                touch_pos.last_x=touch.clientX;
                touch_pos.last_y=touch.clientY;
            }

        }).on('gesturestart',function(){
            last_gesture_scale=1;
        }).on('gesturechange',function(e){
            if(!touch_pos){
                var deltaScale= e.scale -last_gesture_scale;
                scaleImage(deltaScale.toFixed(1)-0)
                last_gesture_scale= e.scale;
            }
        });
        $('.J_buttons').on('click',function(e){
            var tar= e.target,
                role=tar.getAttribute('data-role'),
                deltaScale=0;
            switch (role){
                case 'plus':
                    deltaScale=0.1;
                    break
                case 'minus':
                    deltaScale= -0.1;
                    break
                case 'rotate':
                    rotateImage();
                    break
                default :
                    return
            }
            scaleImage(deltaScale)

        });
        $('.J_topButtons').on('click',function(e){
            var tar= e.target,
                role=tar.getAttribute('data-role');
            switch (role){
                case 'close':
                    $div.hide();
                    break
                case 'ok':
                    var canvas=document.createElement('canvas');
                    canvas.width=canvas.height=RECT;
                    var ctx=canvas.getContext('2d');
                    var sx= ($div.width()-RECT)/ 2-bg_info.x ,
                        sy= ($div.height()-RECT)/2-bg_info.y,
                        scalex=(bg_info.width*bg_info.scale)/im.width;
                   // var imgData=canvasContext.getImageData(sx/scalex,sy/scalex,RECT/scalex,RECT/scalex);
                    ctx.scale(scalex,scalex);
                    ctx.drawImage(im,-sx/scalex,-sy/scalex,im.width,im.height);
                    //ctx.putImageData(imgData,0,0,0,0,RECT,RECT)
                    //console.log(bg_info);

                    /*
                    if(bg_info.rotate){
                        var sx=bg_info.x - ($div.width()-RECT)/ 2,
                            sy=bg_info.y - ($div.height()-RECT)/2;
                        ctx.rotate((Math.PI / 180) * bg_info.rotate);
                        ctx.drawImage(im,0,0,im.width,im.height,sy,sx,bg_info.width*bg_info.scale,bg_info.height*bg_info.scale);
                    }else{
                        var sx=bg_info.x - ($div.width()-RECT)/ 2,
                            sy=bg_info.y - ($div.height()-RECT)/2;
                        ctx.drawImage(im,0,0,im.width,im.height,sx,sy,bg_info.width*bg_info.scale,bg_info.height*bg_info.scale);
                    }*/

                    document.body.appendChild(canvas)
                    $div.hide();
                    break
                default :
                    return
            }



        })



    }
  }
})
