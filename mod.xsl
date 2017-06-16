<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.image-rect">
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-image-rect" ox-mod="wurui/image-rect">
            <xsl:if test="env/domain = 'local'">
                <label class="J_trigger">Demo click HERE!</label>
                <br/><br/><br/><br/><br/>
                <code>
                    You can use:
                    <br/>
                    <small>
                    OXJS.callFunction('wurui/image-rect','render',[src,function(base64){}]);
                    </small>
                </code>
            </xsl:if>
            <div class="image-rect-fulllayer J_fullLayer" style="display:none;">
                <div class="top-button J_topButtons">
                    <button data-role="close">关闭</button>
                    <button data-role="ok">完成</button>
                </div>
                <div class="image-box"><button class="J_touchTigger touch-trigger"></button></div>
                <div class="image-button J_buttons">
                    <button data-role="rotate">&#8635;</button>
                    &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;
                    <button data-role="minus">-</button>
                    <span class="J_scale scale-index">100%</span>
                    <button data-role="plus">+</button>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
