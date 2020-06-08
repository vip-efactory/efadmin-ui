/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-8-8
 * Time: 下午2:00
 * To change this template use File | Settings | File Templates.
 */
var templates = [
    {
        "pre":"pre0.png",
        'title':lang.blank,
        'preHtml':'<p class="ue_t">&nbsp;欢迎使用UEditor！</p>',
        "html":'<p class="ue_t">欢迎使用UEditor！</p>'

    },
    {
        "pre":"pre1.png",
        'title':"产品详情页",
        'preHtml':'产品详情页，可以直接填写内容，不需要的版块可以直接删除，参数表格里的多行文本可以用alt+enter换行保持行间距统一',
        "html":'<div class="pl-5 pr-5"><p>[输入产品概述内容]</p></div><h4 class="p-3 mybluebg text-color-light mb-5 mt-5 btn-rounded pl-5">结构图</h4><div class="pl-5 pr-5"><p class="text-center">[输入产品图片 建议1000像素宽度]</p></div><h4 class="p-3 mybluebg text-color-light mb-5 mt-5 btn-rounded pl-5">产品特色</h4><div class="pl-5 pr-5"><p><ul class="list"><li>[输入产品特色]</li></ul></p></div><h4 class="p-3 mybluebg text-color-light mb-5 mt-5 btn-rounded pl-5">技术参数</h4><div class="row mb-5 pl-5 pr-5"><div class="col"><table class="table table-striped table-responsive"><thead><tr><th>类别</th><th>内容</th></tr></thead><tbody><tr><th scope="row">核心数量</th><td>[内容]</td></tr><tr><th scope="row">核心频率</th><td>[内容]</td></tr><tr><th scope="row">电压参数</th><td>[内容]</td></tr><tr><th scope="row">Cache容量</th><td>[内容]</td></tr><tr><th scope="row">存储空间</th><td>[内容]</td></tr><tr><th scope="row">存储器接口</th><td>[内容]</td></tr><tr><th scope="row">IO接口</th><td>[内容]</td></tr><tr><th scope="row">封装特性</th><td>[内容]</td></tr><tr><th scope="row">功耗</th><td>[内容]</td></tr></tbody></table></div></div>'

    },
    {
        "pre":"pre2.png",
        'title':"解决方案详情页",
        'preHtml':'解决方案详情页',
        "html":'<div class="row mb-5"><div class="col"><table class="table table-striped"><thead><tr><th>类别</th><th>参数</th></tr></thead><tbody><tr><th scope="row">处理器</th><td>[内容]</td></tr><tr><th scope="row">内存</th><td>[内容]</td></tr><tr><th scope="row">显卡</th><td>[内容]</td></tr><tr><th scope="row">存储</th><td>[内容]</td></tr><tr><th scope="row">I/O</th><td>[内容]</td></tr></tbody></table></div></div>'

    },
    {
        "pre":"pre3.png",
        'title':lang.richText,
        'preHtml':'<h1 label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;" class="ue_t">[此处键入文章标题]</h1><p><img src="http://img.baidu.com/hi/youa/y_0034.gif" width="150" height="100" border="0" hspace="0" vspace="0" style="width:150px;height:100px;float:left;" />图文混排方法</p><p>图片居左，文字围绕图片排版</p><p>方法：在文字前面插入图片，设置居左对齐，然后即可在右边输入多行文</p><p><br /></p><p><img src="http://img.baidu.com/hi/youa/y_0040.gif" width="100" height="100" border="0" hspace="0" vspace="0" style="width:100px;height:100px;float:right;" /></p><p>还有没有什么其他的环绕方式呢？这里是居右环绕</p><p><br /></p><p>欢迎大家多多尝试，为UEditor提供更多高质量模板！</p>',
        "html":'<p><br /></p><h1 label="Title center" name="tc" style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;text-align:center;margin:0px 0px 20px;" class="ue_t">[此处键入文章标题]</h1><p><img src="http://img.baidu.com/hi/youa/y_0034.gif" width="300" height="200" border="0" hspace="0" vspace="0" style="width:300px;height:200px;float:left;" />图文混排方法</p><p>1. 图片居左，文字围绕图片排版</p><p>方法：在文字前面插入图片，设置居左对齐，然后即可在右边输入多行文本</p><p><br /></p><p>2. 图片居右，文字围绕图片排版</p><p>方法：在文字前面插入图片，设置居右对齐，然后即可在左边输入多行文本</p><p><br /></p><p>3. 图片居中环绕排版</p><p>方法：亲，这个真心没有办法。。。</p><p><br /></p><p><br /></p><p><img src="http://img.baidu.com/hi/youa/y_0040.gif" width="300" height="300" border="0" hspace="0" vspace="0" style="width:300px;height:300px;float:right;" /></p><p>还有没有什么其他的环绕方式呢？这里是居右环绕</p><p><br /></p><p>欢迎大家多多尝试，为UEditor提供更多高质量模板！</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p>占位</p><p><br /></p><p><br /></p>'
    },
    {
        "pre":"pre4.png",
        'title':lang.sciPapers,
        'preHtml':'<h2 style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;text-align:center;" class="ue_t">[键入文章标题]</h2><p><strong><span style="font-size:12px;">摘要</span></strong><span style="font-size:12px;" class="ue_t">：这里可以输入很长很长很长很长很长很长很长很长很差的摘要</span></p><p style="line-height:1.5em;"><strong>标题 1</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">这里可以输入很多内容，可以图文混排，可以有列表等。</span></p><p style="line-height:1.5em;"><strong>标题 2</strong></p><ol style="list-style-type:lower-alpha;"><li><p class="ue_t">列表 1</p></li><li><p class="ue_t">列表 2</p></li><ol style="list-style-type:lower-roman;"><li><p class="ue_t">多级列表 1</p></li><li><p class="ue_t">多级列表 2</p></li></ol><li><p class="ue_t">列表 3<br /></p></li></ol><p style="line-height:1.5em;"><strong>标题 3</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">来个文字图文混排的</span></p><p style="text-indent:2em;"><br /></p>',
        'html':'<h2 style="border-bottom-color:#cccccc;border-bottom-width:2px;border-bottom-style:solid;padding:0px 4px 0px 0px;margin:0px 0px 10px;text-align:center;" class="ue_t">[键入文章标题]</h2><p><strong><span style="font-size:12px;">摘要</span></strong><span style="font-size:12px;" class="ue_t">：这里可以输入很长很长很长很长很长很长很长很长很差的摘要</span></p><p style="line-height:1.5em;"><strong>标题 1</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">这里可以输入很多内容，可以图文混排，可以有列表等。</span></p><p style="line-height:1.5em;"><strong>标题 2</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">来个列表瞅瞅：</span></p><ol style="list-style-type:lower-alpha;"><li><p class="ue_t">列表 1</p></li><li><p class="ue_t">列表 2</p></li><ol style="list-style-type:lower-roman;"><li><p class="ue_t">多级列表 1</p></li><li><p class="ue_t">多级列表 2</p></li></ol><li><p class="ue_t">列表 3<br /></p></li></ol><p style="line-height:1.5em;"><strong>标题 3</strong></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">来个文字图文混排的</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">这里可以多行</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">右边是图片</span></p><p style="text-indent:2em;"><span style="font-size:14px;" class="ue_t">绝对没有问题的，不信你也可以试试看</span></p><p><br /></p>'
    }
];