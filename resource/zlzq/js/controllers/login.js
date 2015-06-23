define(['BaseView', "cUIInputClear", "Model", "Store", "text!TplLogin"], function (BaseView, cUIInputClear, Model, Store, TplLogin) {
    var self;
    var View = BaseView.extend({
            ViewName: 'source',
            events: {
                "click  #submit": "toSignIn",
                "click .btn_get_password": "toResetPsw",
                "click .favourite":"toFavorite",
                "click #register": "toReg",
                "click .mine" :"toUserCenter",
                "click .bottom-bar .rent":"toRent",
                "click .bottom-bar .mine":"toPersonal",
                "click .bottom-bar .order":"toOrder",
                //"click .bottom-bar .schedule":"toSchedule",
                "click #getPwd": "toGetPwd",
                "click .get-pwd-box .g_btn_s":"getPwd"
            },
            showMyToast: function (msg, time) {
                self.showToast({
                    datamodel: {
                        content: msg
                    },
                    maskToHide: false,
                    hideSec: time
                });
            },

            getPwd:function(e) {
                var mobile = $.trim(self.$el.find(".get-pwd-box .mobile").val());
                if (!mobile) {
                    this.showMyToast("请输入手机号", 1000);
                    return;
                }
                if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
                    this.showMyToast("请输入正确的手机号", 1000);
                    return;
                }
                this.showLoading();
                var url = "http://zlzq.easybird.cn/api/v1/users/reset_password";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data: {cell: mobile},
                    success: function (data) {

                        self.showMyToast("新密码已经以短信的形式发送你手机！", 3000);
                        Lizard.goTo("login.html");
                        self.hideLoading();
                    },
                    error: function (e) {
                        self.hideLoading();
                        self.showMyToast("服务器异常", 1000);
                    }
                });
            },
            toGetPwd:function(e) {
                self.$el.find(".login").addClass("get-pwd");
                self.setGetPwdHeader();
            },
            setGetPwdHeader:function(){
                self.header.set({
                    title: '忘记密码',
                    back: !0,
                    backtext: '<i class="icon-back "></i>  ',
                    view: this,
                    events: {
                        returnHandler: function () {
                            self.$el.find(".login").removeClass("get-pwd");
                            self.setHeader();
                        },
                        commitHandler: function () {

                        }
                    }
                });
            },

            toReg: function (e) {
                Lizard.goTo("register.html");
            },
            toSignIn: function () {
                var mobile = $.trim(this.$el.find("#username").val());
                if (!mobile) {
                    this.showMyToast("请输入手机号", 1000);
                    return;
                }
                if( !/^(1[3-8][0-9])\d{8}$/.test(mobile)){
                    this.showMyToast("请输入正确的手机号", 1000);
                    return;
                }
                var password = $.trim(this.$el.find("#password").val());
                if (!password) {
                    this.showMyToast("请输入密码", 1000);
                    return;
                }
                this.showLoading();
                var url = "http://zlzq.easybird.cn/api/v1/users/login";
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    data: {cell: mobile, password: password},
                    success: function (data) {
                        self.hideLoading();
                        if (data.error) {
                            self.showMyToast("用户名或密码错误！", 1000);
                            return
                        }
                        if (data.user) {
                            data.user.token=data.token;
                            data.user.nick_name=data.nick_name;
                            data.user.avatar=data.avatar
                            self.setLoginStatus({isLogin: true,user: data.user,token:data.token});

                            Lizard.goTo("index.html");
                        }

                    },
                    error: function (e) {
                        self.hideLoading();
                        self.showMyToast("服务器异常", 1000);
                    }
                });
            },
            ajaxException: function (msg) {
                self.loginBtn.html("登录");
                self.hideLoading();
                self.showMyToast('网络错误，请重试', 2000);
            },
            onCreate: function () {
                self = this;
                self.$el.html(TplLogin);
            },

            onShow: function () {
                var noCheck = Lizard.P("noCheck");
                self.setHeader();
                self.showLoading();

                self.hideLoading();

                console.log(this.isLogin())

            },
            //设置标题
            setHeader: function (type) {
                self.header.set({
                    title: '登录',
                    back: !0,
                    backtext: '<i class="top_more left"></i> ',
                    view: this,
                    events: {
                        returnHandler: function () {

                        },
                        commitHandler: function () {

                        }
                    }
                });
            }
        }
    );
    return View;
});