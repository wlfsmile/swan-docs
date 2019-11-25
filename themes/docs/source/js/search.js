/**
 * @file 搜索框事件处理
 */

// 节流
var timer;
var debounce = function (fn, delay) {
    return function () {
        var ctx = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(ctx, args);
        }, (delay ? delay : 300));
    };
};

// 渲染搜索sug
var renderSearchSug = function (keywords, resData, docsIsEmpty, fourmIsEmpty) {
    var str = '';
    docsIsEmpty = docsIsEmpty || false;
    fourmIsEmpty = fourmIsEmpty || true;
    if (!docsIsEmpty) {
        resData.forEach(function (list) {
            str += '<div class="top-search-sug-item">'
                + '<div class="sug-item-broad-name">'+ list.boardInfo.name + '</div>'
                + '<ul>';
            list.forEach(function (item) {
                var path = `https://smartprogram.baidu.com${item.path}`;
                str += '<li>'
                    + '<a href="'+ path +' target="_blank"">'
                    + ' <span class="sug-item-tag">'+ item.tagName +'</span>'
                    + '<span class="sug-item-content">'
                    +     '<p class="sug-item-content-title">'+ item.title +'</p>'
                    +     '<p class="sug-item-content-des">'+ item.description +'</p>'
                    + '</span>'
                    + '</a>'
                    + '</li>';
            });
            str += '</ul>'
                + '</div>'
                + '</div>';
        });
        str += ' <div class="top-search-sug-more">'
            +  ` <a href="https://smartprogram.baidu.com/forum/search?word=${keywords}&scope=devdocs" target="_blank">`
            +  '查看更多 >'
            +  '</a>'
            +  '</div>'
    }
    else if (docsIsEmpty && !fourmIsEmpty) {
        str += '<div class="top-search-sug-docs-empty">'
            +  `<a href="https://smartprogram.baidu.com/forum/search?word=${keywords}&scope=devfourm">`
            +  '文档没有相关内容，查看社区搜索结果 >'
            +  '</a>'
            +  '</div>'
    }
    $('#top-search-sug').innerHTML = str;
};

function searchFunc(searchId, contentId) {
    var $input = document.getElementById(searchId);
    if (!$input || !$('#local-search-input').length) {
        return;
    }

    var flag = true;
    $input.addEventListener('compositionstart', function () {
        flag = false;
    });

    $input.addEventListener('compositionend', function () {
        flag = true;
    });

    $input.addEventListener('input', function (e) {
        var $this = this;
        debounce(function () {
            if (!flag) {
                return;
            }
            var keywords = $this.value.trim();
            console.log(222333, keywords)
            if (keywords.length < 0) {
                return;
            } else {
                $.ajax({
                    url: '/forum/api/search_main?word=' + keywords + '&scope=devdocs',
                    dataType: 'json',
                    type: 'GET',
                    success: function (res) {
                        var resData = res.data;
                        if (resData.length === 0) {
                            $.ajax({
                                url: '/forum/api/search_main?word=' + keywords + '&scope=devform',
                                dataType: 'json',
                                type: 'GET',
                                success: function(res) {
                                    if (res.data.length === 0) {
                                        renderSearchSug(keywords, [], true, true);
                                    } else {
                                        renderSearchSug(keywords, ['文档没有内容，去社区查看>>'], true, false);
                                    }
                                }
                            })
                        } else {
                            renderSearchSug(keywords, resData, true);
                        }
                    }
                });
            }
        }, 500)();
    });

    //阻止回车刷新页面
    $input.addEventListener('keydown', function (e) {
        var e = e || event;
        if (e.keyCode === 13) {
            e.returnValue = false;
            e.preventDefault();
            // 搜索跳转打点
            _hmt.push(['_trackEvent', 'search', '搜索跳转', e.target.value]);
            window.open(`${window.location.origin}/forum/search?word=${e.target.value}&scope=devdocs`, '_blank');
        }
    })
}