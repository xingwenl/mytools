require(["vue.min", "utils"], function (Vue, utils) {
	mui.plusReady(function () {
		var btn = new utils.navigationbarBtn();
		btn.setBtn("../../img/face.jpg")
		btn.setBtn("../../img/face.jpg", "left")
		btn.click(function () {
			console.log("right")
		}, function () {
			console.log("left")
		})
		var selfView = plus.webview.currentWebview()
		var ul = document.getElementById("ul")
		selfView.setPullToRefresh({
			support: true,
			height: "50px",
			range: "0",
			contentdown:{
				caption:"下拉刷新"
			},
			contentover:{
				caption:"释放刷新"
			},
			contentrefresh:{
				caption:"正在刷新"
			}
//			contentup:
		}, function () {
			setTimeout(function () {
				if (ul) {
					var item = document.createElement("li");
					item.innerHTML = '<li class="mui-table-view-cell"><a class="mui-navigate-right"> ' + (new Date().getDate()) + '</a></li>';
					ul.insertBefore(item, ul.firstChild);
				}
				selfView.endPullToRefresh();
			})
			selfView.setBounce({position:{top:"100px"},changeoffset:"10px"})
			selfView.addEventListener("dragBounce",function(e){
				console.log(JSON.stringify(e))
			})
		})
		
		
	})
})