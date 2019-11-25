/**
 * @file Generate programsearch JSON 生成小程序专用的搜索json文件
 * @author Zhang Wenli <wulinfei@baidu.com>
 */

const fs = require('fs');
const {BOARD_MAP, TAG_MAP, BOARD_URL_MAP} = require('./utils/constant');

// 获取导航链接，如果导航不存在link，则找其sidebar第一项的链接
const findLink = navItem => {
    if (navItem.link) {
        return navItem.link;
    }
    const sidebar = navItem.sidebar;
    if (sidebar && sidebar[0].link) {
        return sidebar[0].link;
    }
    return findLink(sidebar[0]);
};

/* global hexo */
hexo.extend.generator.register('programSearch', function (locals) {
    const config = this.config;
    const searchConfig = config.search;
    let searchfield = searchConfig.field;

    let posts;
    let pages;
    let navs = locals.data.nav;
    // 递归生成搜索结果面包屑
    let resBreadCrumbs = [];
    // 将侧边栏数据加入搜索结果 && 过滤掉不存在侧边栏的文档
    navs.forEach(function (nav) {
        nav.nav.forEach(function (nav) {
            generateNavItem(nav);
        });
    });

    function generateNavItem(navItem) {
        const link = findLink(navItem);
        navItem.breadCrumbs = [{name: navItem.text, link: '/docs' + link}];
        resBreadCrumbs.push(navItem);
        if (navItem.sidebar) {
            generateNav(navItem.sidebar, [{name: navItem.text, link: '/docs' + link}], 0);
        }
    }

    function generateNav(nav, breadCrumbs, index) {
        index++;
        nav.forEach(function (na) {
            na.breadCrumbs = breadCrumbs.slice(0);
            resBreadCrumbs.push(na);
            if (na.sidebar) {
                const link = findLink(na);
                const temp = breadCrumbs.slice(0, index);
                temp.push({name: na.text, link: '/docs' + link});
                generateNav(na.sidebar, temp, index);
            }
        });
    }

    resBreadCrumbs = resBreadCrumbs.map(function (item) {
        item.breadCrumbs = item.breadCrumbs.filter(function (subitem) {
            return subitem.name && subitem.link;
        });

        item.breadCrumbs.push({name: item.text, link: '/docs' + item.link});

        return {
            breadCrumbs: item.breadCrumbs,
            title: item.text,
            url: '/docs' + item.link,
            name: item.name
        };
    });

    if (searchfield.trim() !== '') {
        searchfield = searchfield.trim();
        if (searchfield === 'post') {
            posts = locals.posts.sort('-date');
        }
        else if (searchfield === 'page') {
            pages = locals.pages;
        }
        else {
            posts = locals.posts.sort('-date');
            pages = locals.pages;
        }
    }
    else {
        posts = locals.posts.sort('-date');
    }

    let res = [];
    let index = 0;

    const navList = {};

    resBreadCrumbs.forEach(function (item) {
        // const itemUrl = item.url.trim().replace(/^\//g, '').replace(/\/$/g, '');
        const itemUrl = item.url.trim().replace(/\//g, '');
        if (itemUrl.indexOf('#') > 0) {
            return;
        }
        navList[itemUrl] = item.title;
    });

    posts = posts.filter(function (post) {
        const postPath = config.root + post.path;
        const postPathUrl = postPath.trim().replace(/\//g, '');
        return navList[postPathUrl];
    });

    [posts, pages].forEach(function (posts) {
        if (posts) {
            posts.each(function (post) {
                if (post.draft) {
                    return;
                }
                const tmpPost = {};
                tmpPost.title = post.title || '';
                tmpPost.url = config.root + post.path || '';
                tmpPost.tagName = TAG_MAP[post.nav] || '';
                tmpPost.boardName = BOARD_MAP[post.header] || '';
                tmpPost.categoryName = post.categoryName || '';
                if (post._content) {
                    tmpPost.content = post.more ? replaceHtml(post.more) : includeMarkdown(post._content);
                }
                if (post.tags && post.tags.length > 0) {
                    const tags = [];
                    const tagIndex = 0;
                    const setName = function (tag) {
                        tags[tagIndex] = tag.name;
                    };
                    post.tags.each(setName);
                    tmpPost.tags = tags;
                }
                if (post.categories && post.categories.length > 0) {
                    const categories = [];
                    const catIndex = 0;
                    const setName = function (cate) {
                        categories[catIndex] = cate.name;
                    };
                    post.categories.each(setName);
                    tmpPost.categories = categories;
                }
                // tmpPost.breadCrumbs = [tmpPost.title + ',' + tmpPost.url.slice(5)];
                const tmpPostUrl = tmpPost.url.replace(/\//g, '');
                const tmpPostBreadCrumbs = resBreadCrumbs.filter(function (item) {
                    const itemUrl = item.url.replace(/\//g, '');
                    return (itemUrl === tmpPostUrl) && (item.name === post.sidebar);
                });
                if (tmpPostBreadCrumbs.length > 0) {
                    tmpPost.breadCrumbs = tmpPostBreadCrumbs[0].breadCrumbs;
                }
                else {
                    tmpPost.breadCrumbs = [{name: tmpPost.title, link: tmpPost.url}];
                }
                tmpPost.breadCrumbs.unshift({name: BOARD_MAP[post.header], link: BOARD_URL_MAP[post.header]});
                res[index] = tmpPost;
                index += 1;
            });
        }
    });

    // 删除小游戏文档
    res = res.filter(function (item) {
        return item.url.indexOf('/docs/game/') === -1;
    });
    const json = JSON.stringify([...res]);

    return {
        path: 'programSearch.json',
        data: json
    };
});

function includeMarkdown(content) {
    // Find path in content
    const regExp = new RegExp('<!-- md (.*?) -->');
    let match = regExp.exec(content);

    // Find all includes
    while (match && match.length > 1) {
        const path = (match && match.length > 1) ? match[1] : '';

        // Read content of included file
        const file = fs.readFileSync('source/_posts/' + path, 'utf8');

        // Replace including tag
        const replaceRegExp = new RegExp(`<!-- md ${path} -->`, 'g');
        content = content.replace(replaceRegExp, file);

        // Find next include
        match = regExp.exec(content);
    }
    return content;
}

// 去除所有html标签 转为纯文本
function replaceHtml(str) {
    str = str.replace(/(\r\n|\n)/g, '')               // 换行
    .replace(/\s/g, '')                              // 空格
    .replace(/<!--.*?\/-->/g, '')                   // 注释
    .replace(/<pre.*?\/pre>/g, '')                 // 去掉代码片段
    .replace(/<[^>]+>/g, '');                     // html标签

    return str;
}