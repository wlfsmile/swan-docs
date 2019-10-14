---
title: 加速度计
header: develop
nav: api
sidebar: device_accelerometer
---


## swan.onAccelerometerChange

**解释**：监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 swan.stopAccelerometer 停止监听。

**百度APP中扫码体验：**

<img src="https://b.bdstatic.com/miniapp/assets/images/doc_demo/getGravity.png"  class="demo-qrcode-image" />


**方法参数**：Function callback

**`callback`参数说明**：

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
|x |Number |是|-|X 轴|
|y |Number |是|-|Y 轴|
|z |Number |是|-|Z 轴|

**示例**：
<a href="swanide://fragment/0ed5fe5e4d0957055cd7669fd83612731569478872196" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>

* 在 js 文件中

```javascript

    onReady() {
        this.position = {
            x: 151,
            y: 151,
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0
        };
        let self = this;
        swan.onAccelerometerChange(function (res) {
            self.setData({
                x: res.x.toFixed(2),
                y: res.y.toFixed(2),
                z: res.z.toFixed(2)
            });
            self.position.ax = Math.sin(res.x * Math.PI / 2);
            self.position.ay = -Math.sin(res.y * Math.PI / 2);

        });

    }
```
 
#### 错误码
* Andriod

|错误码|说明|
|--|--|
|1001|执行失败   |

* iOS

|错误码|说明|
|--|--|
|202|解析失败，请检查参数是否正确      |
|1001|设备不支持否正确      |
## swan.startAccelerometer

**解释**：开始监听加速度数据。

**方法参数**：Object object

**`object`参数说明**：

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
|interval|String |否 |normal|监听加速度数据回调函数的执行频率|
|success |Function  |  否 |-|  接口调用成功的回调函数|
|fail  |  Function |   否 | -| 接口调用失败的回调函数|
|complete |   Function |   否  | -|接口调用结束的回调函数（调用成功、失败都会执行）|

**interval 的合法值**

根据机型性能、当前 CPU 与内存的占用情况，interval 的设置与实际 swan.onAccelerometerChange() 回调函数的执行频率会有一些出入。

|值 |说明|
|---- | ---- |
|game |适用于更新游戏的回调频率，在 20ms/次 左右|
|ui |适用于更新 UI 的回调频率，在 60ms/次 左右|
|normal |普通的回调频率，在 200ms/次 左右|

**示例**：

<a href="swanide://fragment/0ed5fe5e4d0957055cd7669fd83612731569478872196" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>

* 在 js 文件中

```js
Page({
    startAccelerometer() {
        swan.startAccelerometer({
            interval: 'ui',
            success: res => {
                console.log('startAccelerometer success', res);
            },
            fail: err => {
                console.log('startAccelerometer fail', err);
            }
        });
    }
});
```

## swan.stopAccelerometer

**解释**：停止监听加速度数据。

**方法参数**：Object object

**`object`参数说明**：

|参数名 |类型  |必填 | 默认值 |说明|
|---- | ---- | ---- | ----|----|
|success |Function  |  否 | -| 接口调用成功的回调函数|
|fail  |  Function |   否 | -| 接口调用失败的回调函数|
|complete |   Function |   否  |-| 接口调用结束的回调函数（调用成功、失败都会执行）|

**示例**：

<a href="swanide://fragment/0ed5fe5e4d0957055cd7669fd83612731569478872196" title="在开发者工具中预览效果" target="_self">在开发者工具中预览效果</a>


* 在 js 文件中

```js
Page({
    onLoad() {
        swan.startAccelerometer({
            interval: 'ui'
        });
    },
    stopAccelerometer() {
        swan.stopAccelerometer({
            success: res => {
                console.log('startAccelerometer success', res);
            },
            fail: err => {
                console.log('startAccelerometer fail', err);
            }
        });
    }
});
```
