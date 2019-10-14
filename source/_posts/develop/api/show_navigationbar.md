---
title: 设置导航条
header: develop
nav: api
sidebar: show_navigationbar
---
## swan.setNavigationBarTitle

**解释**：动态设置当前页面的标题。

**百度APP中扫码体验：**

<img src="https://b.bdstatic.com/miniapp/assets/images/doc_demo/setNavigationBarTitle.png"  class="demo-qrcode-image" />


**方法参数**： Object object

**`object`参数说明**：

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
|title   |String|  是 |-|  页面标题|
|success |Function |   否 |-|   接口调用成功的回调函数|
|fail   | Function|    否 |-|   接口调用失败的回调函数|
|complete   | Function   | 否| -|   接口调用结束的回调函数（调用成功、失败都会执行）|

**示例**：
<a href="swanide://fragment/66fa0985fb6f44388c9b21f76651cfe51569464933222" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>

* 在 js 文件中

```js
    swan.setNavigationBarTitle({
        title: 'xxx',
        success: res => {
            console.log('setNavigationBarTitle success', res);
        },
        fail: err => {
            console.log('setNavigationBarTitle fail', err);
        }
    });
```
#### 错误码

* Andriod

|错误码|说明|
|--|--|
|1001|执行失败   |



* iOS

|错误码|说明|
|--|--|
|202|解析失败，请检查参数是否正确   |

## swan.showNavigationBarLoading

**解释**： 该方法在当前页面显示导航条加载动画。

**百度APP中扫码体验：**

<img src="https://b.bdstatic.com/miniapp/assets/images/doc_demo/navigationBarLoading.png"  class="demo-qrcode-image" />


**方法参数**：无

**示例**：

<a href="swanide://fragment/c4a65ff2c078e16699cc67084b4e842f1569465767383" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>


* 在 js 文件中

```js
showNavigationBarLoading() {
    swan.showNavigationBarLoading();
}
```

#### 错误码

**Andriod**

|错误码|说明|
|--|--|
|1001|执行失败   |

## swan.hideNavigationBarLoading

**解释**： 隐藏导航条加载动画。

**百度APP中扫码体验：**

<img src="https://b.bdstatic.com/miniapp/assets/images/doc_demo/navigationBarLoading.png"  class="demo-qrcode-image" />


**方法参数**：无

**示例**：

<a href="swanide://fragment/c4a65ff2c078e16699cc67084b4e842f1569465767383" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>


* 在 js 文件中

```js
hideNavigationBarLoading() {
    swan.hideNavigationBarLoading();
}
```
#### 错误码

**Andriod**

|错误码|说明|
|--|--|
|1001|执行失败   |

## swan.setNavigationBarColor

**解释**：动态设置当前页面导航条的颜色。

**方法参数**： Object object

**`object`参数说明**：

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
|frontColor | String|  是  |-| 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000。|
|backgroundColor| String | 是  |-| 背景颜色值，有效值为十六进制颜色。|
|animation  | Object  |否  |-| 动画效果|
|success |Function  |  否 |-|  接口调用成功的回调函数|
|fail|    Function |   否  |-| 接口调用失败的回调函数|
|complete|    Function |   否   |-|接口调用结束的回调函数（调用成功、失败都会执行）|

**animation**

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
| duration|Number | 否  |0|动画变化时间，单位：毫秒。|
|timingFunc|String | 否  |linear| 动画变化方式  |

**animation.timingFunc 有效值**：

|值  | 说明|
| ---- |---- |
|linear|  动画从头到尾的速度是相同的。|
|easeIn | 动画以低速开始|
|easeOut |动画以低速结束。|
|easeInOut  | 动画以低速开始和结束。|

<!-- **success返回参数说明**：

|参数名 |类型  |说明|
|---- | ---- |---- |
|errMsg | String  |调用结果| -->


**示例**：

<a href="swanide://fragment/5324faec9c72f07b9827b7a08ac9a2791569466207792" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>


* 在 js 文件中

```js
swan.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#3C76FF',
    animation: {
        duration: 500,
        timingFunc: 'linear'
    },
    success: res => {
        console.log('setNavigationBarColor success');
    },
    fail: err => {
        console.log('setNavigationBarColor fail', err);
    }
});
```

#### 错误码

* Andriod

|错误码|说明|
|--|--|
|1001|执行失败     |

* iOS

|错误码|说明|
|--|--|
|202|解析失败，请检查参数是否正确   |
