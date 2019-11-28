/**
 * @file 搜索框事件处理
 */

// const {get} = require('./utils/request');

var origin = window.location.origin;
// 请求函数
var get = function (requestUrl, successFn, failFn) {
    try {
        $.ajax({
            url: requestUrl,
            dataType: 'json',
            type: 'GET',
            success: successFn,
            fail: failFn
        });
    }
    catch (err) {
        console.error('ajax运行错误', err);
    }
};

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
    var $topSug = $('#top-search-sug');
    var str = '';
    docsIsEmpty = docsIsEmpty || false;
    if (!docsIsEmpty) {
        str += '<div class="top-search-sug-result">';
        resData.forEach(function (list) {
            const docList = list.docList || [];
            str += '<div class="top-search-sug-item">'
                + `<div class="sug-item-broad-name">${list.boardInfo.name}</div>`
                + '<ul>';
            docList.forEach(function (item) {
                var path = `${origin}${item.path}`;
                str += '<li>'
                    + `<a onmousedown="navToSearch('${path}')">`
                    + ` <span class="sug-item-tag">${item.tagInfo.name}</span>`
                    + '<span class="sug-item-content">'
                    +     `<p class="sug-item-content-title">${item.title}</p>`;
                if (item.description) {
                    str += `<p class="sug-item-content-des">${item.description}</p>`;
                }
                str += '</span>'
                    + '</a>'
                    + '</li>';
            });
            str += '</ul>'
                + '</div>';
        });
        str += '</div>'
            +  ' <div class="top-search-sug-more">'
            +  ` <a onmousedown="navToSearch('${origin}/forum/search?word=${keywords}&scope=devdocs&source=docs')" target="_blank">`
            +  '查看更多 >'
            +  '</a>'
            +  '</div>';
    }
    else if (docsIsEmpty && !fourmIsEmpty) {
        str += '<div class="top-search-sug-docs-empty">'
            +  `<a onmousedown="navToSearch('${origin}/forum/search?word=${keywords}&scope=devfourm&source=docs')" target="_blank">`
            +  '文档没有相关内容，查看社区搜索结果 >'
            +  '</a>'
            +  '</div>';
    }
    $topSug.html(str);
    $topSug.css({
        display: 'block'
    });
};

// 获取社区的sug数量（在文档sug数为0时请求）
var getFourmSug = function (keywords) {
    get('/forum/api/search_category?word=' + keywords + '&scope=devforum', function (res) {
        if (res.data.length === 0) {
            renderSearchSug(keywords, [], true, true);
            return;
        }
        renderSearchSug(keywords, [], true, false);
    });
};

var navToSearch = function (path) {
    window.open(path, '_blank');
};

var searchFunc = function (searchId, contentId) {
    var $input = document.getElementById(searchId);
    var $input1 = document.getElementById('local-search-input1');
    if (!$input || !$('#local-search-input').length) {
        return;
    }

    $('#top-search-box1').on('click', function (e) {
        if ($(e.target).hasClass('reset-search-btn')) {
            $('#top-search-box').removeClass('top-search-box-focus');
            $('.m-doc-level1').css({
                'display': 'none'
            });
            $(this).addClass('top-search-box-focus');
            $input1.focus();
        }
    });

    $($input1).on('blur', function (e) {
        $('#top-search-box').removeClass('top-search-box-focus');
        $('.m-doc-level1').css({
            'display': 'block'
        });
    });

    // 保证输入事件结束后，才触发搜索
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
            if (keywords.length <= 0) {
                renderSearchSug('', [], true, true);
                return;
            } else {
                get(`/forum/api/search_category?word=${keywords}&scope=devdocs`, function (res) {
                    var resData = res.data;
                    if (resData.length === 0) {
                        getFourmSug(keywords);
                        return;
                    }
                    renderSearchSug(keywords, resData, false, true);
                });
            }
        }, 500)();
    });

    $input.addEventListener('blur', function () {
        $('#top-search-sug').css({
            display: 'none'
        });
    });

    $input.addEventListener('focus', function () {
        $('#top-search-sug').css({
            display: 'block'
        });
    });

    // 阻止回车刷新页面
    $input.addEventListener('keydown', function (e) {
        var e = e || event;
        var keywords = e.target.value;
        if (e.keyCode === 13) {
            e.returnValue = false;
            e.preventDefault();
            if (!keywords) {
                // e.target.value = '';
                return;
            }
            // 搜索跳转打点
            _hmt.push(['_trackEvent', 'search', '搜索跳转', keywords]);
            window.open(`${origin}/forum/search?word=${keywords}&scope=devdocs&source=docs`, '_blank');
        }
    });

    // 搜索图标点击
    $('#search-btn').on('click', function () {
        var keywords = $input.value;
        if (!keywords) {
            // e.target.value = '';
            return;
        }
        _hmt.push(['_trackEvent', 'search', '搜索跳转', keywords]);
        window.open(`${origin}/forum/search?word=${keywords}&scope=devdocs&source=docs`, '_blank');        
    });
};
