# Picker 选择器

该组件是移动端的选择器，可以用于实现单列或多列选项的选择。同时也支持级联选择（cascade）。

注意：该组件的级联选择功能，不支持混用级别！也就是说就是你的数据级别要么全部都是二级联动，要么全部都是三级联动。不能有的项有三级子级，而有的项又没有三级子级。如果真实数据确有这种情况。需要先处理数据。



## 依赖

- jQuery

- better-scroll

  > better-scroll官网：<https://ustbhuangyi.github.io/better-scroll/#/>



## 演示图

![](http://chuantu.xyz/t6/702/1562635165x2362407012.gif)

![](http://chuantu.xyz/t6/702/1562635089x2362407012.gif)

![](http://chuantu.xyz/t6/702/1562635632x2362407012.gif)



## 参数说明

这四个参数，前三个都是必需的。最后一个 isCascade 可以不传。

| 参数          | 说明                                                         | 类型    | 默认值 |
| :------------ | :----------------------------------------------------------- | :------ | :----- |
| data          | 传入 picker 数据，数组的长度决定了 picker 的列数             | Array   | []     |
| selectedIndex | 被选中的索引值，拉起 picker 后显示这个索引值对应的内容。需要和data的长度对应 | Array   | []     |
| option        | 选项：各种个性化配置和回调的处理 ( 具体看后面的option表格说明 ) | String  | ''     |
| isCascade     | 是否是级联类型picker                                         | Boolean | false  |



## Option说明

| 属性名          | 说明                                                         | 类型     |
| --------------- | ------------------------------------------------------------ | -------- |
| zIndex          | picker的绝对定位的层级                                       | Number   |
| confirmCallback | Picker点击确实按钮时的回调函数。回调函数中的参数如下：<br />参数1：选定的数据 (Array); <br />参数2：选择的索引 (Array) | Function |



## 示例

### 1）单列选择器

```
var column1 = [{"value":0,"text":"0-测试-0"},{"value":1,"text":"0-测试-1"},{"value":2,"text":"0-测试-2"},{"value":3,"text":"0-测试-3"},{"value":4,"text":"0-测试-4"}]

//数据格式
var list = [column1]

//创建实例
var picker = new JPicker();

//创建picker
picker.create(list, [0], {
        confirmCallback: function (data, index) {
            console.log(data)
            console.log(index)
            this.hide()
        }
}, false)
```



### 2）多列选择器

```
var column1 = [{"value":0,"text":"0-测试-0"},{"value":1,"text":"0-测试-1"},{"value":2,"text":"0-测试-2"},{"value":3,"text":"0-测试-3"},{"value":4,"text":"0-测试-4"}]

var column2 = [{"value":0,"text":"0-测试-0"},{"value":1,"text":"0-测试-1"},{"value":2,"text":"0-测试-2"},{"value":3,"text":"0-测试-3"},{"value":4,"text":"0-测试-4"}]

var column3 = [{"value":0,"text":"0-测试-0"},{"value":1,"text":"0-测试-1"},{"value":2,"text":"0-测试-2"},{"value":3,"text":"0-测试-3"},{"value":4,"text":"0-测试-4"}]

//数据格式
var list = [column1,column2,column3]

//创建实例
var picker = new JPicker();

//创建picker
picker.create(list, [0,0,0], {
        confirmCallback: function (data, index) {
            console.log(data)
            console.log(index)
            this.hide()
        }
}, false)
```



### 3）级联选择器

第四个参数一定要设为：true

```
//数据格式
var cascade = [
            {
                "value": "1--1",
                "text": "湖北省",
                "children": [
                    {
                        "value": "2--1",
                        "text": "武汉市",
                        "children": [
                            {
                                "value": "3--1",
                                "text": "汉阳区",
                                "children": [
                                ]
                            }
                        ]
                    },
                    {
                        "value": "2--2",
                        "text": "天门市",
                        "children": [
                            {
                                "value": "3--1",
                                "text": "天门区",
                                "children": [
                                ]
                            },
                            {
                                "value": "3--2",
                                "text": "武湖区",
                                "children": [
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "value": "1--2",
                "text": "湖南省",
                "children": [
                    {
                        "value": "2--1",
                        "text": "长沙市",
                        "children": [
                            {
                                "value": "3--1",
                                "text": "辣椒区",
                                "children": [
                                ]
                            },
                            {
                                "value": "3--2",
                                "text": "甜品区",
                                "children": [
                                ]
                            }
                        ]
                    }
                ]
            }
        ]

//创建实例
var picker = new JPicker();

//创建picker 
picker.create(cascade, [0,0,0], {
        confirmCallback: function (data, index) {
            console.log(data)
            console.log(index)
            this.hide()
        }
}, true)
```



# 存在的问题

- 参数可以优为一个JOSN对象，用属性方式传入
- 支持级联类型的Picker混用级别
- 源码中的destroyed方法没有实现
- 源码中的_updatePickerData方法中关于data的判断可能会引起bug
- 源码中的_pickerChange方法在数据更新配视图渲染上的处理，应该可以优化，而不是现在的这样的用三个单独的循环