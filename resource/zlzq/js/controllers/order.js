define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","text!TplOrder"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,TplOrder) {
    var self;
    var View = BaseView.extend({
        ViewName: 'comment',
        events: {
            "click .housing .btn":"toReserve",
            "click .location_icon" :"toLocation",
            "click .search-btn":"toSearch",
            "click .order-list .btn":"toSubscribe",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            "click .bottom-bar .order":"toOrder",
            //"click .bottom-bar .schedule":"toSchedule"
        },
        changeTab: function (e) {
            var target = $(e.currentTarget),
                 icon=target.find(".b-icon"),
                tab = target.data("key");
            icon.toggleClass("active");
        },
        toSubscribe:function(e){
            Lizard.goTo("subscribe.html");
        },
        toReserve:function(e){
            self.$el.find(".info_ct").hide();
            self.$el.find(".housing").hide();
            self.$el.find(".reserve_ct").show();
        },
        ajaxException: function (msg) {
            self.loginBtn.html("登录");
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;
            // self.$el.html(TplHouse);

        },
        getList:function(callback){
            var url="http://zlzq.easybird.cn/api/v1/users/44/my_orders?auth_token=-xpii7D1bro3BqQQpqS_",
                paras={},
                method="get";
            if(Lizard.P("favorite")){
                url=url+"liked_realties?auth_token="+self.getCurrentUser().token;
            }

            $.ajax({
                url: url,
                dataType: "json",
                type: method,
                data:paras,
                success: function (data) {
                    self.hideLoading();
                    self.$el.html(_.template(TplList, {list: data.realties}));

                },
                error: function (e) {
                    self.showMyToast("服务器异常", 1000);
                    self.hideLoading();
                }
            });
        },
        onShow: function () {
            self.setHeader();

            self.$el.html(TplOrder);
            self.hideLoading();


        },
        //设置标题
        setHeader: function () {
            self.header.set({
                title: '我的订单',
                back: true,
                backtext: '<i class="icon-back "></i> ',
                view: this,
                btn: {
                    title: '编辑',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        Lizard.goTo("house.html");
                    },
                    commitHandler: function () {

                    }
                }
            });
        },
        onHide: function () {

        }
    });

    return View;
})
