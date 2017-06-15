define([],function(){
    var tpl='<div class="image-rect-fulllayer"><div class="image-box"></div></div>',
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

        var im=new Image;


        $trigger.attr('for',inputId);

        var $file=$('<input type="file" style="position:fixed;top:-999px;left:-999px;" id="'+inputId+'"/>').appendTo('body')
        $file.on('change',function(e){
            getFileData(this.files[0],function(result){
                im.onload = placeImage;
                im.src=bg_info.src=result;
                $div.show();
                $file.val('')
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
                $div.addClass('transition').css({
                    'backgroundSize':bg_info.width * bg_info.scale+'px '+bg_info.height * bg_info.scale+'px',
                    'backgroundPosition':bg_info.x + 'px ' + bg_info.y + 'px'
                });
                $scale.html(Math.round(bg_info.scale*100)+'%');
            }
        }
        var placeImage=function(){
            if(!bg_info.src){
                return
            }
            bg_info.width=Math.min($div.width(),im.width)

            bg_info.height=im.height * bg_info.width/im.width;
            bg_info.scale=1;
            bg_info.x= ($div.width() - bg_info.width)/2;
            bg_info.y= ($div.height() - bg_info.height)/2;

            //console.log('bg_info',bg_info)
            $div.css({
                'backgroundImage':'url('+bg_info.src+')',
                'backgroundSize':bg_info.width * bg_info.scale+'px '+bg_info.height * bg_info.scale+'px',
                'backgroundPosition':bg_info.x + 'px ' + bg_info.y + 'px'
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
                $div.removeClass('transition')

            }else{
                touch_pos=null
            }


        }).on('touchmove',function(e){
            if(touch_pos){//console.log('moving')
                var touch= e.changedTouches[0];

                bg_info.x+= touch.clientX - touch_pos.last_x
                bg_info.y+= touch.clientY - touch_pos.last_y


                $div.css('backgroundPosition',bg_info.x+'px '+bg_info.y+'px')

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
                    $div.hide();
                    break
                default :
                    return
            }



        })

    }
  }
})
