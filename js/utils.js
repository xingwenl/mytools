define({
	// 日期转换
	format: function () {
		//author: meizz
		var date = new Date(time)
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	//判断是否为空对象
	isEmptyObj: function (obj) {
		var t
		for (t in obj)
			return false
		return true
	},
	timingCallback: function (params) {
		params.since = params.since || new Date().getTime()
		params.duration = params.duration || 60
		params.delay = params.delay || 1000
		params.onUpdate = params.onUpdate || function () {}
		params.onEnd = params.onEnd || function () {}

		var endTime = params.endTime || params.since + params.duration * 1000
		var interval = setInterval(update, params.delay)

		function update() {
			var nowTime = new Date().getTime()
			var restTime = endTime - nowTime
			params.onUpdate && params.onUpdate(restTime, nowTime)
			if (endTime < nowTime) {
				clearInterval(interval)
				params.onEnd && params.onEnd(nowTime)
			}
		}

		return function () {
			clearInterval(interval)
		}
	},
	isPhoneNum: function (cellphone) {
		if (cellphone.length == 11) return true
		return false
		//	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		//	return myreg.+++++(cellphone)
	},
	getDateDiff: function (publishTime) {
		var d_seconds, d_minutes, d_hours, d_days, timeNow = parseInt(new Date().getTime() / 1000),
			d,
			date = new Date(publishTime * 1000),
			Y = date.getFullYear(),
			M = date.getMonth() + 1,
			D = date.getDate(),
			H = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();
		//小于10的在前面补0
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		if (H < 10) {
			H = '0' + H;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (s < 10) {
			s = '0' + s;
		}
		d = timeNow - publishTime;
		d_days = parseInt(d / 86400);
		d_hours = parseInt(d / 3600);
		d_minutes = parseInt(d / 60);
		d_seconds = parseInt(d);

		if (d_days > 0 && d_days < 3) {
			return d_days + '天前';
		} else if (d_days <= 0 && d_hours > 0) {
			return d_hours + '小时前';
		} else if (d_hours <= 0 && d_minutes > 0) {
			return d_minutes + '分钟前';
		} else if (d_seconds < 60) {
			if (d_seconds <= 0) {
				return '刚刚发表';
			} else {
				return d_seconds + '秒前';
			}
		} else if (d_days >= 3 && d_days < 30) {
			return M + '-' + D + ' ' + H + ':' + m;
		} else if (d_days >= 30) {
			return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
		}
	},
	base64ToImage: function (base64URL) {
		return new Promise(function (resole, reject) {
			var b = new plus.nativeObj.Bitmap();
			var hb_path = '_downloads/image/' + md5(image_url) + '.jpg'; //转为唯一路径 基于md5
			b.loadBase64Data(base64URL, function () {
				console.log("创建成功");
				b.save(hb_path, {
					overwrite: true
				}, function () {
					var sd_path = "file://" + plus.io.convertLocalFileSystemURL(hb_path); //转为绝对路径
					resole(sd_path)
				}, function () {
					mui.toast("保存失败")
				});
			}, function () {
				mui.toast("创建失败")
			});
		})
	},
	navigationbarBtn: function () {
		//默认右边按钮
		var navigationbar = plus.webview.currentWebview().getNavigationbar();
		this.setBtn = function (path, type, p) {
			var left = type === "left" ? "10px" : (window.innerWidth - 34);
			var position = {
				top: "10px" || p.top,
				left: left || p.left,
				width: "24px" || p.width,
				height: "24px" || p.height
			}
			var bitmap = new plus.nativeObj.Bitmap("left", path)
			navigationbar.drawBitmap(bitmap, {}, position)
		}
		this.click = function (rightCallback, leftCallback) {
			navigationbar.addEventListener("click", function (e) {
				var x = e.clientX
				if (x < 44) {
					leftCallback && leftCallback()
				} else if (x > (window.innerWidth - 44)) {
					rightCallback && rightCallback()
				}
			})
		}
	},
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
})

/*
// 日期转换
function format(time, fmt) {}

// 判断是否为空对象
function isEmptyObj(obj) {
	var t
	for (t in obj)
		return false
	return true
}

function timingCallback(params) {
	params.since = params.since || new Date().getTime()
	params.duration = params.duration || 60
	params.delay = params.delay || 1000
	params.onUpdate = params.onUpdate || function () {}
	params.onEnd = params.onEnd || function () {}

	var endTime = params.endTime || params.since + params.duration * 1000
	var interval = setInterval(update, params.delay)

	function update() {
		var nowTime = new Date().getTime()
		var restTime = endTime - nowTime
		params.onUpdate && params.onUpdate(restTime, nowTime)
		if (endTime < nowTime) {
			clearInterval(interval)
			params.onEnd && params.onEnd(nowTime)
		}
	}

	return function () {
		clearInterval(interval)
	}
}

function isPhoneNum(cellphone) {
	if (cellphone.length == 11) return true
	return false
	//	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
	//	return myreg.+++++(cellphone)
}

function getDateDiff(publishTime) {

	var d_seconds,
		d_minutes,
		d_hours,
		d_days,
		timeNow = parseInt(new Date().getTime() / 1000),
		d,

		date = new Date(publishTime * 1000),
		Y = date.getFullYear(),
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	//小于10的在前面补0
	if (M < 10) {
		M = '0' + M;
	}
	if (D < 10) {
		D = '0' + D;
	}
	if (H < 10) {
		H = '0' + H;
	}
	if (m < 10) {
		m = '0' + m;
	}
	if (s < 10) {
		s = '0' + s;
	}
	d = timeNow - publishTime;
	d_days = parseInt(d / 86400);
	d_hours = parseInt(d / 3600);
	d_minutes = parseInt(d / 60);
	d_seconds = parseInt(d);

	if (d_days > 0 && d_days < 3) {
		return d_days + '天前';
	} else if (d_days <= 0 && d_hours > 0) {
		return d_hours + '小时前';
	} else if (d_hours <= 0 && d_minutes > 0) {
		return d_minutes + '分钟前';
	} else if (d_seconds < 60) {
		if (d_seconds <= 0) {
			return '刚刚发表';
		} else {
			return d_seconds + '秒前';
		}
	} else if (d_days >= 3 && d_days < 30) {
		return M + '-' + D + ' ' + H + ':' + m;
	} else if (d_days >= 30) {
		return Y + '-' + M + '-' + D + ' ' + H + ':' + m;
	}
}
//引入js
function include(path) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = path;
	script.charset = "utf-8"
	var head = document.body
	head.appendChild(script);
}

// 判断本地是否安装客户端
function isInstalled(id) {
	if (id === 'qihoo' && mui.os.plus) {
		return true;
	}
	if (mui.os.android) {
		var main = plus.android.runtimeMainActivity();
		var packageManager = main.getPackageManager();
		var PackageManager = plus.android.importClass(packageManager)
		var packageName = {
			"qq": "com.tencent.mobileqq",
			"weixin": "com.tencent.mm",
			"sinaweibo": "com.sina.weibo"
		}
		try {
			return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
		} catch (e) {}
	} else {
		switch (id) {
			case "qq":
				var TencentOAuth = plus.ios.import("TencentOAuth");
				return TencentOAuth.iphoneQQInstalled();
			case "weixin":
				var WXApi = plus.ios.import("WXApi");
				return WXApi.isWXAppInstalled()
			case "sinaweibo":
				var SinaAPI = plus.ios.import("WeiboSDK");
				return SinaAPI.isWeiboAppInstalled()
			default:
				break;
		}
	}
}
//判断网络
function getNetType() {
	var nt = plus.networkinfo.getCurrentType();
	switch (nt) {
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
			return "WIFI"
			break;
		case plus.networkinfo.CONNECTION_CELL2G:
			return "2G"
		case plus.networkinfo.CONNECTION_CELL3G:
			return "3G"
		case plus.networkinfo.CONNECTION_CELL4G:
			return "4G"
			break;
		default:
			{
				mui.toast("网络异常，请检查网络状态")
				return "default"
			}
			break;
	}
}

//改变图片质量
function compressImage(src) {
	return new Promise(function (resolve, reject) {
		plus.zip.compressImage({
				src: src,
				dst: "_downloads/image/" + "dst" + src.split("/").pop(),
				overwrite: true, //是否覆盖原有图片
				quality: 60 //压缩质量1-100默认50
			},
			function (event) {
				resolve(event.target)
			},
			function (error) {
				reject(error)
			});
	})

}

function clipGalleryImg(src) {
	return new Promise(function (resolve, reject) {
		var img = document.createElement("img")
		img.src = src
		// 加载完成执行
		img.onload = function () {
			var left;
			var top;
			var width;
			var height;
			//获取照片方向角属性，用户旋转控制  
			EXIF.getData(img, function () {
				EXIF.getAllTags(this);
				Orientation = EXIF.getTag(this, 'Orientation');
				//判定是竖屏照相 此时长大于宽            
				if (Orientation == 6) {
					var w = img.width
					img.width = img.height
					img.height = w
				}
				if (img.width < img.height) {
					left = "0px"
					top = -((img.height - img.width) / 2) / (img.width / 100) + "px"
					width = "100%"
					height = "auto"
				} else {
					left = -((img.width - img.height) / 2) / (img.height / 100) + "px"
					top = 0 + "px"
					height = "100%"
					width = "auto"
				}
				var clipRect = "left:" + left + ";height:" + height + ";width:" + width + ";top:" + top + ";"
				resolve(clipRect)
			});
		};
		img.onerror = function () {
			reject("图片错误")
		}
	})
}
//裁剪图片
function clipRectImage(src) {
	return new Promise(function (resolve, reject) {
		var img = document.createElement("img")
		img.src = src
		// 加载完成执行
		img.onload = function () {
			var left;
			var top;
			var width;
			var height;
			//获取照片方向角属性，用户旋转控制  
			if (img.width < img.height) {
				left = "0px"
				top = -((img.height - img.width) / 2) / (img.width / 100) + "px"
				width = "100%"
				height = "auto"
			} else {
				left = -((img.width - img.height) / 2) / (img.height / 100) + "px"
				top = 0 + "px"
				height = "100%"
				width = "auto"
			}
			var clipRect = "left:" + left + ";height:" + height + ";width:" + width + ";top:" + top + ";"
			resolve(clipRect)
		};
		img.onerror = function () {
			reject("图片错误")
		}
	})
}

// localStorage 获取封装
function getStore(name, isJSON) {
	if (!isJSON) isJSON = true
	var value = localStorage.getItem(name)
	return isJSON ? JSON.parse(value) : value
}
// localStorage 写入封装
function setStore(name, value, isJSON) {
	if (!isJSON) isJSON = true
	localStorage.setItem(name, isJSON ? JSON.stringify(value) : value)
}

function closeWebview(id) {
	if (isObject(id)) {
		id.forEach(function (e) {
			if (plus.webview.getWebviewById(e)) {
				plus.webview.getWebviewById(e).close('none')
			}
		})
	} else {
		if (plus.webview.getWebviewById(id)) {
			plus.webview.getWebviewById(id).close('none')
		}
	}
}

// 判断是否为对象
function isObject(obj) {
	return obj !== null && typeof obj === 'object'
}
/*
function captionImage($imageBox) {
	promiseCaptureImage()
		.then(promiseResolveLocalFileSystemURL)
		.then(function(res) {
			console.log(JSON.stringify(res))
			console.log(res)
			$imageBox.attr('src', res)
			return res
		})
		.then(promiseLoadImage)
		.then(converImgToBase64)
		.then(function(res) {
			$imageBox.data('base64', res)
		})
		.catch(function(err) {
			mui.toast(err)
		})
}


function galleryImg($imageBox, filename) {
	promisePickImage(filename)
		.then(promiseResolveLocalFileSystemURL)
		.then(function(res) {
			console.log(JSON.stringify(res))
			console.log(res)
			$imageBox.attr('src', res)
			return res
		})
		.then(promiseLoadImage)
		.then(converImgToBase64)
		.then(function(res) {
			$imageBox.data('base64', res)
		})
		.catch(function(err) {
			mui.toast('出现错误')
		})
};

*/
/*
function promiseCaptureImage() {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	return new Promise(function (resolve, reject) {
		cmr.captureImage(function (path) {
				resolve(path)
			},
			function (error) {
				reject(error)
			}, {
				filename: "_downloads/image",
				resolution: res,
				format: fmt,
			}
		);
	})
}

function promisePickImage(filename) {
	return new Promise(function (resolve, reject) {
		plus.gallery.pick(function (res) {
			resolve(res)
		}, function (err) {
			reject(err)
		}, {
			filter: "image",
			filename: "_downloads/image"
		})
	})
}

function promisePickImageFiles() {
	return new Promise(function (resolve, reject) {
		plus.gallery.pick(function (e) {
			resolve(e)
		}, function (e) {
			reject("取消选择图片")
			//			console.log("");
		}, {
			filter: "image",
			filename: "_downloads/image",
			multiple: true,
			maximum: 9,
			system: false
		}); // 最多选择9张图片	
	})
}

function promiseResolveLocalFileSystemURL(path) {
	return new Promise(function (resolve, reject) {
		plus.io.resolveLocalFileSystemURL(path, function (entry) {
			resolve(entry.toLocalURL())
		}, function (err) {
			reject(err)
		})
	})
}

function promiseLoadImage(imgPath) {
	var img = new Image();
	return new Promise(function (resolve, reject) {
		img.crossOrigin = 'Anonymous';
		img.src = imgPath;
		img.onload = function () {
			resolve(img)
		}
		img.onerror = function (err) {
			reject(err)
		}
	})
}

function promiseFileReader(file) {
	var oFReader = new FileReader();
	return new Promise(function (resolve, reject) {
		oFReader.readAsDataURL(file);
		oFReader.onload = function (oFREvent) {
			resolve(oFREvent.target.result)
		};
		oFReader.onerror = function (error) {
			reject(error)
		}
	})
}

function converImgToBase64(img, outputFormat) {
	var canvas = document.createElement('CANVAS')
	var ctx = canvas.getContext('2d')
	var width = img.width;
	var height = img.height;
	if (width > height) {
		if (width > 100) {
			height = Math.round(height *= 100 / width);
			width = 100;
		}
	} else {
		if (height > 100) {
			width = Math.round(width *= 100 / height);
			height = 100;
		}
	}
	canvas.height = height
	canvas.width = width
	ctx.drawImage(img, 0, 0, width, height)
	var dataURL = canvas.toDataURL(outputFormat || 'image/png')
	canvas = null
	return dataURL
}
var actionSheet_fn;
var popView_fn;
(function () {
	var wc, ws;
	var callbackA;
	mui.plusReady(function () {
		ws = plus.webview.currentWebview();
		ws.addEventListener("maskClick", function () {
			ws.setStyle({
				mask: "none"
			});
			if (wc) {
				wc.close();
			}
		}, false);
	})
	document.addEventListener("popview", function (e) {
		if (e.detail) {
			ws.setStyle({
				mask: "none"
			});
			if (wc) {
				wc.hide();
				callbackA(e.detail)
			}
		}
	})
	//	wc.addEventListener("close",function(){
	//		if (ws) {
	//			ws.setStyle({
	//					mask: "none"
	//			});			
	//		}
	//	})
	//	wc.addEventListener("hide",function(){
	//		if (ws) {
	//			ws.setStyle({
	//					mask: "none"
	//			});			
	//		}
	//	})

	/**
	 * actionSheet_fn
	 * @param {String} stings
	 * @param {Array} array
	 * @param {Function}
	 */
/*
	actionSheet_fn = function (title, content, callback) {
		var height = plus.screen.resolutionHeight
		if (!plus.navigator.isImmersedStatusbar()) {
			height = localStorage.getItem("height") - localStorage.getItem("statusbarHeight")
		}
		var t = height - (content.length + 2) * 43 - 15
		if (plus.webview.getWebviewById("side")) {
			wc = plus.webview.getWebviewById("side")
			mui.fire(wc, "update", {
				"list": {
					title: title,
					content: content
				}
			})
			wc.show("slide-in-bottom", 200);
			wc.addEventListener("show", function () {
				// 开启遮罩
				ws.setStyle({
					mask: "rgba(0,0,0,0.5)"
				});
				//			wc.show("slide-in-bottom", 100);
			}, false);
		} else {
			wc = plus.webview.create("../common/popview-page.html", "side", {
				top: t,
				width: "100%",
				popGesture: "none",
				zindex: 50
			}, {
				"list": {
					title: title,
					content: content
				}
			});
			//页面加载后显示（避免白屏）
			wc.addEventListener("loaded", function () {
				wc.show("slide-in-bottom", 200);
			}, false);
			wc.addEventListener("show", function () {
				// 开启遮罩
				console.log(JSON.stringify(wc))
				ws.setStyle({
					mask: "rgba(0,0,0,0.5)"
				});
				//			wc.show("slide-in-bottom", 100);
			}, false);

		}
		// 页面关闭后关闭遮罩
		wc.addEventListener('close', function () {
			wc = null;
		}, false);

		callbackA = function (e) {
			callback(e)
		}
	}

	popView_fn = function () {
		var height = localStorage.getItem("height")
		if (!plus.navigator.isImmersedStatusbar()) {
			height = localStorage.getItem("height") - localStorage.getItem("statusbarHeight")
		}
		var t = height - 100
		console.log(height)
		console.log(t)
		if (plus.webview.getWebviewById("share")) {
			wc = plus.webview.getWebviewById("share")
			mui.fire(wc, "update", {
				"list": {
					title: "title",
					content: "content"
				}
			})
			wc.show("slide-in-bottom", 200);
			wc.addEventListener("show", function () {
				// 开启遮罩
				ws.setStyle({
					mask: "rgba(0,0,0,0.5)"
				});
				//			wc.show("slide-in-bottom", 100);
			}, false);
		} else {
			wc = plus.webview.create("../common/share.html", "share", {
				top: t,
				width: "100%",
				popGesture: "none",
				zindex: 50
			}, {
				"list": {
					title: "title",
					content: "content"
				}
			});
			//页面加载后显示（避免白屏）
			wc.addEventListener("loaded", function () {
				wc.show("slide-in-bottom", 200);
			}, false);
			wc.addEventListener("show", function () {
				// 开启遮罩
				console.log(JSON.stringify(wc))
				ws.setStyle({
					mask: "rgba(0,0,0,0.5)"
				});
			}, false);

		}
		// 页面关闭后关闭遮罩
		wc.addEventListener('close', function () {
			wc = null;
		}, false);

		callbackA = function (e) {
			callback(e)
		}
	}
})()
*/