function searchFunc(path, searchId, contentId) {
    $.ajax({
        url: path,
        dataType: 'json',
        success: function (datas) {
            // remove gamedoc
            datas = datas.filter(function(item) {
                    return item.url.indexOf('/docs/game/') === -1;
                });
            var $resultContent = document.getElementById(contentId);
            var $input = document.getElementById(searchId);
            if (!$input || !$('#local-search-input').length) {
                return;
            }
            function toggleArticleContent(isShown) {
                var isToggle = typeof isShown === 'undefined';
                var resultStatus, articleStatus;
                if (isToggle) {
                    var currentStatus = $('#article-main-content').css('display');
                    resultStatus = currentStatus;
                    articleStatus = currentStatus === 'block' ? 'none' : 'block';
                } else {
                    articleStatus = isShown ? 'block' : 'none';
                    resultStatus = isShown ? 'none' : 'block';
                }
                $('#article-main-content').css({
                    display: articleStatus
                });
                $($resultContent).css({
                    display: resultStatus
                });
            }
            function toggleArticleContent(isShown) {
                var isToggle = typeof isShown === 'undefined';
                var resultStatus, articleStatus;
                if (isToggle) {
                    var currentStatus = $('#article-main-content').css('display');
                    resultStatus = currentStatus;
                    articleStatus = currentStatus === 'block' ? 'none' : 'block';
                } else {
                    articleStatus = isShown ? 'block' : 'none';
                    resultStatus = isShown ? 'none' : 'block';
                }
                $('#article-main-content').css({
                    display: articleStatus
                });
                $($resultContent).css({
                    display: resultStatus
                });
            }
            $('#top-search-box').on('click', function (e) {
                if($(e.target).hasClass('reset-search-btn')) {
                    toggleArticleContent(true);
                    $('#top-search-box').removeClass('top-search-box-focus');
                   return; 
                }
                $(this).addClass('top-search-box-focus');
                $input.focus();
            });

            $($input).on('blur', function () {
                $(this).val() || $('#top-search-box').removeClass('top-search-box-focus');
            });

            var flag = true;
            $input.addEventListener('compositionstart', function () {
                flag = false;
            });

            $input.addEventListener('compositionend', function () {
                flag = true;
            });
            //阻止回车刷新页面
            $input.addEventListener('keydown', function(e){
                var e = e || event;
                if (e.keyCode === 13) {
                    e.returnValue = false;
                    e.preventDefault();
                    window.open(`https://smartprogram.baidu.com/forum/search?word=${e.target.value}&scope=devdocs`, '_blank');
                }
            })
        }
    });
}
// 处理点击结果，keywords高亮展示
function handleResultAClick (url, keywords) {
    if (!keywords.length) {
        return;
    }
    window.localStorage.setItem('keywords', keywords);
    window.open(url);
}
// 替换当前匹配的markdown内容，取第一句话
function replaceMarkdown(str) {
    str = str.replace(/(\r\n|\n)/g, '')                          // 全局匹配换行                                               //全局匹配换行
    .replace(/\s/g, '')                                          // 全局匹配空字符
    .replace(/(<\w+?)\s(?:\s*\w*?\s*=\s*'.+?')*?\s*?(>)/g, '$1$2') // 去除标签属性
    .replace(/\!\[[\s\S]*?\]\([\s\S]*?\)/g, '')                  // 全局匹配图片
    .replace(/\[[\s\S]*?\]\([\s\S]*?\)/g, '')                    // 全局匹配连接
    .replace(/(\*)(.*?)(\*)/g, '')                               // 全局匹配强调
    .replace(/`{1,2}[^`](.*?)`{1,2}/g, '')                       // 全局匹配内联代码块
    .replace(/```([\s\S]*?)```[\s]*/g, '')                       // 全局匹配代码块
    .replace(/[\s]*[-\*\+]+(.*)/g, '')                           // 全局匹配无序列表
    .replace(/[\s]*[0-9]+\.(.*)/g, '')                           // 全局匹配有序列表
    .replace(/(\|-{1,})+\|/g, '')                                // 全局匹配表格内容
    .replace(/(\|.*?)+/g, '')                                    // 全局匹配表头内容
    .replace(/(#+)/g, '')                                        // 全局匹配标题
    .replace(/(>+)/g, '');                                        // 全局匹配摘要
    const firstPeriodIndex = str.indexOf('。') + 1;
    return str.slice(0, firstPeriodIndex ? firstPeriodIndex : str.length);
}
