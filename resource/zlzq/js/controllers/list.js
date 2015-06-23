define(['BaseView', "cUIInputClear","cUIImageSlider" ,"Model", "Store","UIScroll","cRange","text!TplList"], function (BaseView, cUIInputClear,cUIImageSlider, Model, Store,cUIScroll,cRange,TplList) {
    var self,districtsList,
         listModel=Model.ListModel.getInstance();
    var View = BaseView.extend({
        ViewName: 'list',
        hasTouch :'ontouchstart' in window,
        events: {
            "click .favourite": "toFavorite",
            "click .rent": "toRent",
            "click .house-list li": "toHouse",
            "click .location_icon": "toLocation",
            "click .l-ct ": "toIndex",
            "click .house-type>li div":"setHouseType",
            "click .filter-list li": "setFilter",
           // "touchstart .range-bar": "startRentRange",
            //"touchmove  .range-icon": "setRentRange",
            //"touchend   .range-icon": "endRentRange",
           // "mousedown .range-icon": "startRentRange",
            "click .sort-list li":"setSortFilter",
            "click a.yes":"setTypeFilter",
            "click .right-column li":"setAreaFilter",
            "click .left-column li":"setDistrictFilter",
            "click .r-bar input":"toGetAreaList",
            "click .r-bar .btn":"cancel",
            "click .bottom-bar .rent":"toRent",
            "click .bottom-bar .mine":"toPersonal",
            "click .bottom-bar .order":"toOrder",
            "click .bottom-bar .schedule":"toSchedule",
            "click .search-icon":"toSearch"
        },
        cancel:function(e){
            self.$el.find(".r-bar input").val("");
            self.$el.find(".searchBar-inner").removeClass("active");
        },
        toGetAreaList:function(e){
            self.$el.find(".searchBar-inner").addClass("active");
        },
        setSortFilter:function(e) {
            self.$el.find(".sort-list li").each(function () {
                var $this = $(this);
                $this.removeClass("active");
            });
            $(e.currentTarget).addClass("active");
            var currentBox = self.$el.find(".sort-bar-box");
            currentBox.find(".sort-bar").removeClass("show");
            currentBox.hide();
            self.$el.find(".mask").hide();
        },
        setTypeFilter:function(e) {

            var currentBox = self.$el.find(".type-bar-box");
            currentBox.find(".type-bar").removeClass("show");
            self.$el.find(".mask").hide();



        },
        setDistrictFilter:function(e){
            self.$el.find(".left-column li").each(function () {
                var $this = $(this);
                $this.removeClass("current");
            });
            $(e.currentTarget).addClass("current");
        },
        setAreaFilter:function(e) {
            self.$el.find(".right-column li").each(function () {
                var $this = $(this);
                $this.removeClass("selected");
            });
            $(e.currentTarget).addClass("selected");
            var currentBox = self.$el.find(".area-bar-box");
            currentBox.find(".area-bar").removeClass("show");
            currentBox.hide();
            self.$el.find(".mask").hide();
        },
        setHouseType:function(e) {
            self.$el.find(".house-type>li div").each(function () {
                var $this = $(this);
                $this.removeClass("selected");
            });
            $(e.currentTarget).addClass("selected");
        },
        startRentRange:function(e) {
            e.preventDefault();
            self.rentRangePoint = self.hasTouch ? e.touches[0] : e;

            $(document).bind("touchmove", self.setRentRange);
            $(document).bind("touchend", self.endRentRange);

            //if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf("range-icon") > -1) {
            //    return;
            //}

           // var rangeX = self.$el.find(".range-bar")[0].getBoundingClientRect().left;

          //  self.rangeIcon.css("left", self.rentRangePoint.pageX - rangeX);
            self.rentRangeIcnleft = self.rangeIcon.position().left;

            if (!self.hasTouch) {
                $(document).bind("mousemove", self.setRentRange);
            }
        },
        setRentRange:function(e) {
            e.preventDefault();
            if (!self.rentRangePoint) {
                return
            }


            var point = self.hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - self.rentRangePoint.pageX,
                maxLeft = self.rangeIcon.parent().width() - 20,
                nextLeft = self.rentRangeIcnleft + deltaX,
                left = nextLeft > maxLeft ? maxLeft : nextLeft;


            console.log(deltaX);
            left = left < 0 ? 0 : left;
            self.rangeIcon.css("left", left);
            self.rentRangeInnerBar.width(left);
            if (!self.hasTouch) {
                $(document).bind("mouseup", self.endRentRange);
            }
        },
        endRentRange:function(e){
            self.rentRangePoint=null;
            $(document).off("touchmove",self.setRentRange);
            $(document).off("touchend", this.endRentRange);
            if (!self.hasTouch) {
                $(document).unbind("mousemove", self.setRentRange);
                $(document).unbind("mouseup", self.endRentRange);
            }
        },
        toIndex:function(e){
            Lizard.goTo("index.html");
        },
        toRent:function(e){
            self.toggleSideBar();
            Lizard.goTo("list.html");
        },

        toHouse:function(e){
            var target = $(e.currentTarget);
            Lizard.goTo("house.html?d=" + target.data("id"));
        },
        setFilter:function(e) {
            var target = $(e.currentTarget);
            //if (self.currentFilter == target.data("key")) {
            //    return;
            //}
            self.$el.find(".filter-list li").each(function () {
                var $this = $(this);
                $this.find(".filter-icon").removeClass("selected");
            });
            target.find(".filter-icon").addClass("selected");

            var currentBox = self.$el.find("." + target.data("key") + "-bar-box");
            if (currentBox.find("." + target.data("key") + "-bar").hasClass("show")) {
                return;
            }

            if(target.data("key")=="area") {
                this.scroll.refresh();
            }

            var lastBox = self.$el.find("." + self.lastFilter + "-bar-box");
            lastBox.css("visibility", "visible");
            lastBox.hide();
            lastBox.find("." + self.lastFilter + "-bar").removeClass("show");

            currentBox.css("visibility", "visible");
            currentBox.show();
            currentBox.find("." + target.data("key") + "-bar").addClass("show");
            self.lastFilter = target.data("key");
            self.$el.find(".mask").show();

            document.addEventListener('touchmove', self.preventDefault, false);

        },
        preventDefault:function(e){
            e.preventDefault();
        },
        getDistricts:function(callback){
            $.ajax({
                url: 'http://zlzq.easybird.cn/api/v1/districts',
                dataType: "json",
                contentType: "application/json",
                type: "get",
                success: function (data) {
                    callback && callback(data);
                    districtsList=data.districts;
                }
            });

        },
        ajaxException: function (msg) {
            self.hideLoading();
            self.showMyToast('网络错误，请重试', 2000);
        },
        onCreate: function () {
            self = this;

        },
        getList:function(callback){
            var url="http://zlzq.easybird.cn/api/v1/realties/",
                paras={},
                method="get";
            if(Lizard.P("favorite")){

                url=url+"liked_realties?auth_token="+self.getCurrentUser().token;
            }
            if(Lizard.P("addr")){
                method = "post";
                url=url+"search";
                paras.target=decodeURIComponent(Lizard.P("addr"));
            }

            if(Lizard.P("d")) {
                method = "post";
                paras.district_id=Lizard.P("d");
                url=url+"search";
            }
            $.ajax({
                url: url,
                dataType: "json",
                type: method,
                data:paras,
                success: function (data) {
                    self.hideLoading();
                    self.$el.html(_.template(TplList, {list: data.realties,dlist:districtsList}));

                },
                error: function (e) {
                    self.showMyToast("服务器异常", 1000);
                    self.hideLoading();
                }
            });
        },
        onShow: function () {
            $("#headerview").hide();
            self.getDistricts();
            self.getList();
            self.hideLoading();

            self.rentRange = self.$el.find(".rent-range");
            self.rentRangeBar = self.$el.find(".range-bar");
            self.rentRangeInnerBar = self.$el.find(".range-inner-bar");


            self.rangeIcon = self.$el.find(".range-icon");

            self.range = new cRange("rangeBar");


            this.scrollOpts = {};
            this.scrollOpts.wrapper = this.$(".right-column"), this.scrollOpts.scroller = this.$(".right-column-inner"), this.scroll = new cUIScroll(this.scrollOpts);
        },

        setHeader: function (type) {
            self.header.set({
                title: '&nbsp;',
                back: !0,
                backtext: '<i class="top_more left"></i> ',
                view: this,
                btn: {
                    title: '<i class="top_more right"></i>',
                    id: 'confirm-btn',
                    classname: 'right_btn'
                },
                events: {
                    returnHandler: function () {
                        self.toggleSideBar();
                    },
                    commitHandler: function () {
                        self.$('.searchBar').toggleClass('active');
                    }
                }
            });
        },
        onHide: function () {
            $("#headerview").show();
        }
    });

    return View;
});


