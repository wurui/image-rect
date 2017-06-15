<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.image-rect">
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-image-rect" ox-mod="image-rect"><!--
            <xsl:variable name="fileId" select="concat('File_',generate-id(.))"/>-->
            <br/><br/><br/><br/>
            <label class="J_trigger">Choose file</label>
            <div class="image-rect-fulllayer J_fullLayer" style="display:none;">
                <div class="top-button J_topButtons">
                    <button data-role="close">关闭</button>
                    <button data-role="ok">完成</button>
                </div>
                <div class="image-box"><button class="J_touchTigger touch-trigger"></button></div>
                <div class="image-button J_buttons">
                    <button data-role="minus">-</button>
                    &#160;&#160;&#160;&#160;
                    <span class="J_scale scale-index">100%</span>
                    &#160;&#160;&#160;&#160;
                    <button data-role="plus">+</button>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
