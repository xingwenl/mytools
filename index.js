require(["vue.min"], function (Vue) {
	var vm = new Vue({
		el: "#app",
		created: function () {
			var self = this 
			if (mui.os.plus) {
				mui.plusReady(function () {
					var selfView = plus.webview.currentWebview();
					var id;
					self.tabbar.forEach(function (obj, index) {
						self.subStyle.navigationbar = {
							titletext:obj.title,
							titlecolor:"#000",
							backgroundcolor:"#fff"
						}
						var view = plus.webview.create(obj.href, obj.href, self.subStyle)
						if (index !== self.firstPage) {
							view.hide()
						}
						selfView.append(view);
					})
				})
			} else {
				self.createIframe('.mui-content', {
					url: self.tabbar[self.firstPage].href,
					style: self.subStyle
				})
			}

		},
		data: {
			firstPage: 0,
			tabbar: [{
					title: "首页",
					icon: "mui-icon-home",
					href: "views/home/home.html"
				},
				{
					title: "电话",
					icon: "mui-icon-phone",
					href: "views/tel/tel.html"
				},
				{
					title: "邮件",
					icon: "mui-icon-email",
					href: "views/email/email.html"
				},
				{
					title: "设置",
					icon: "mui-icon-gear",
					href: "views/set/set.html"
				}
			],
			subStyle:{
				top: "0",
				bottom: "51px"
			}
		},
		methods: {
			choosePage: function (item, index, event) {
				var self = this
				if (index == self.firstPage) return
				var tabhref = self.tabbar[self.firstPage].href
				if (mui.os.plus) {
					// 显示目标webview
					plus.webview.show(item.href);
					// 隐藏当前webview
					plus.webview.hide(tabhref);
					// 更改当前活跃的选项卡
					self.firstPage = index;
				} else {
					// 创建iframe代替子页面
					self.createIframe('.mui-content', {
						url: item.href,
						style: self.subStyle
					})
				}
			},
			createIframe: function (el, opt) {
				var elContainer = document.querySelector(el);
				var wrapper = document.querySelector(".mui-iframe-wrapper");
				if (!wrapper) {
					// 创建wrapper 和 iframe
					wrapper = document.createElement('div');
					wrapper.className = 'mui-iframe-wrapper';
					for (var i in opt.style) {
						wrapper.style[i] = opt.style[i];
					}
					var iframe = document.createElement('iframe');
					iframe.src = opt.url;
					iframe.id = opt.id || opt.url;
					iframe.name = opt.id;
					wrapper.appendChild(iframe);
					elContainer.appendChild(wrapper);
				} else {
					var iframe = wrapper.querySelector('iframe');
					iframe.src = opt.url;
					iframe.id = opt.id || opt.url;
					iframe.name = iframe.id;
				}
			}
		}
	})
})