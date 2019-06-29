(function (window) {
    var utils = {   //工具方法

    };

    var JPicker = function () {
        this.init()
    };

    //原型对象别名
    JPicker.fn = JPicker.prototype = {
        init: function () {

            var template = '<div id="jPickerWrap" class="j-popup">\
                                <div class="j-mask"></div>\
                                <div class="j-container">\
                                    <div class="j-content">\
                                        <div class="j-picker-panel j-safe-area-pb">\
                                            <div class="j-picker-choose border-bottom-1px">\
                                                <span class="j-picker-cancel">取消</span>\
                                                <span class="j-picker-confirm">确定</span>\
                                                <div class="j-picker-title-group">\
                                                    <h1 class="j-picker-title">title</h1>\
                                                    <h2 class="j-picker-subtitle" style="display:none"></h2>\
                                                </div>\
                                            </div>\
                                            <div class="j-picker-content">\
                                                <i class="border-bottom-1px"></i>\
                                                <i class="border-top-1px"></i>\
                                                <div class="j-picker-wheel-wrapper" id="jPickerContent"></div>\
                                            </div>\
                                            <div class="j-picker-footer"></div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>';

            this.$dom = $(template);

        },
        /**
         * 
         * @param {*} values 数据
         * @param {*} selectedIndex 当前选中项的索引
         * @param {*} option 选项配置
         */
        create: function (values, selectedIndex, option) {
            var that = this;
            option = option || {};

            //数据
            this._values = values || [];
            //是否有数据在加载
            this.pending = false;
            var len =  this._values.length;

            //存放所有BSroller
            this.BScroller = []

            //当前选中项的索引
            this._selectedIndex = selectedIndex.concat();

            //默认选项配置
            var defaultOption = {
                zIndex: 999, //绝对定位的坐标值
                confirmCallback:function(){ //选择确定后的回调

                }
            }

            this.option = $.extend({}, defaultOption, option)

            //设置样式
            this._setStyle();

            //渲染列表    
            for(var i=0;i<len;i++){
                this._renderScrollList(this._values[i])
            }

            //DOM渲染到页面中
            $('body').append(this.$dom)

            //绑定事件
            this._bindEvent()

            //创建iScroll
            setTimeout(function () {
                for(var i=0;i<len;i++){
                    that._createScroll(i)
                }
            },0)


        },
        show: function (index) {
            var that = this;
            var $panel = this.$dom.find('.j-picker-panel')
            var len =  this._values.length;
            //动画
            this.$dom.fadeIn()
            $panel.slideDown()

            setTimeout(function(){
                
                for(var i=0;i<len;i++){
                    that.BScroller[i].refresh()
                    that.BScroller[i].wheelTo(that._selectedIndex[i] || index)
                }
                
            },0)
            
        },
        hide: function () {
            var $panel = this.$dom.find('.j-picker-panel')

            this.$dom.fadeOut()
            $panel.slideUp()
        },
        destroyed: function () {

        },
        //渲染数据列表
        _renderScrollList: function (list) {
            var $div = $('<div></div>');
            var $wrap = this.$dom.find('#jPickerContent')
            var $ul = $('<ul></ul>');

            $ul.addClass('j-picker-wheel-scroll')
            $div.append($ul)

            $.each(list, function (i, v) {
                var $li = $('<li></li>')

                $li.data('v', v.value).text(v.text).addClass('j-picker-wheel-item')
                $div.children('ul').append($li);
            })
            $wrap.append($div)
        },
        //绑定事件
        _bindEvent: function () {
            var that = this;
            //点遮罩层隐藏
            this.$dom.find('.j-mask,.j-picker-cancel').on('click', function () {
                that.hide()
            })
            //
            //确定按钮
            this.$dom.find('.j-picker-confirm').on('click',function(){
                if(!that._canConfirm()){
                    return false;
                }
                var currentData = [];
                var len =  that._values.length;

                for(var i=0;i<len;i++){
                    currentData.push( that._getCurrentData(that._values[i],i)[0] );
                }
                
                that.option.confirmCallback.call(that,currentData,that._selectedIndex)
               
            })
        },
        _getCurrentData:function(value,n){
            var that = this;
            return $.map(value,function(v,i){
                if(that._selectedIndex[n] == i){
                    return v;
                }
            })
        },
        /**
         * 创建better-scroll
         */
        _createScroll: function (idx) {
            var that = this;
            var wheelWrapper = document.getElementById('jPickerContent');
            var wheeler = this.BScroller[idx] = new BScroll(wheelWrapper.children[idx], {
                //作用：这个配置是为了做 Picker 组件用的，默认为 false，如果开启则需要配置一个 Object。
                //wheelWrapperClass 和 wheelItemClass 必须对应于你的实例 better-scroll 的 wrapper 类名和 wrapper 内的子类名。二者的默认值是 "wheel-scroll"/"wheel-item"
                wheel: {
                    selectedIndex: this._selectedIndex[idx] || 0,
                    wheelWrapperClass: 'j-picker-wheel-scroll',
                    wheelItemClass: 'j-picker-wheel-item'
                },
                //会检测 scroller 内部 DOM 变化，自动调用 refresh 方法重新计算来保证滚动的正确性。
                //它会额外增加一些性能开销，如果你能明确地知道 scroller 内部 DOM 的变化时机并手动调用 refresh 重新计算，你可以把该选项设置为 false。
                observeDOM: false
            });
            //BScroll的索引 会有多个BScroll
            wheeler.idx = idx;

            wheeler.on('scrollEnd', function(){
                //当前BScroll选中的item
                var selectedIdx = this.getSelectedIndex();
                that._selectedIndex[this.idx] = isNaN(selectedIdx) ? that._selectedIndex[this.idx] : selectedIdx;
            })
        },
        _canConfirm() {
            return !this.pending && this.BScroller.every((wheel) => {
              return !wheel.isInTransition
            })
          },
        _setStyle: function () {
            this.$dom.css({
                "z-index": this.option.zIndex
            })
        }
    };

    //全局存储Picker
    window.JPicker = JPicker;

    var Picker = window.JPicker;   //缓存Picker

    //处理命名冲突
    JPicker.noConflict = function () {

        if (window.JPicker === JPicker) {
            window.JPicker = _Picker;
        }

        return JPicker;
    }

    return JPicker;

})(window)