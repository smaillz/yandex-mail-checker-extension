//================================================================
// Copyright 2017 Sonthakit Leelahanon. All rights reserved.
//================================================================
"use strict";


// constant
var maxAutoCheckRange = 181;


// global
var backgroundWin = null;
var soundFile = "";
var audio = null;
var soundFileName = "";
var notificationIcon = "";
var c19 = null;
var g19 = null;
var c38 = null;
var g38 = null;
var c19default = null;
var g19default = null;
var c38default = null;
var g38default = null;
var c80default = null;


function saveAll() {
	if (backgroundWin.siteSupport) {
		for (var i = 0; i < backgroundWin.siteCount; i++) {
			if (document.getElementById("site" + i.toString()).checked) {
				backgroundWin.preference.site = i;
				break;
			}
		}
	}
	backgroundWin.preference.inbox = document.getElementById("inbox").checked;
	backgroundWin.preference.newlyArrived = document.getElementById("newlyArrived").checked;
	var interval = Number(document.getElementById("autoCheckRange").value);
	if (interval === maxAutoCheckRange) {
		backgroundWin.preference.interval = 0x7FFFFFFF;
	} else {
		backgroundWin.preference.interval = Number(document.getElementById("autoCheckRange").value);
	}
	backgroundWin.preference.delayFirstChecking = Number(document.getElementById("delayFirstCheckingRange").value);
	backgroundWin.preference.showToolbarNumber = document.getElementById("showToolbarNumber").checked;
	backgroundWin.preference.disabledLoadingIcon = document.getElementById("disabledLoadingIcon").checked;
	if (document.getElementById("showPopup").checked) {
		backgroundWin.preference.popup = "popup.xhtml";
	} else {
		backgroundWin.preference.popup = "";
	}
	backgroundWin.preference.sound = document.getElementById("sound").checked;
	backgroundWin.preference.display = document.getElementById("display").checked;
	backgroundWin.preference.blink = document.getElementById("blink").checked;
	if (document.getElementById("defaultSound").checked) {
		backgroundWin.soundFile = "default.wav";
		backgroundWin.preference.soundFileName = "";
	} else {
		backgroundWin.soundFile = soundFile;
		backgroundWin.preference.soundFileName = soundFileName;
	}
	backgroundWin.preference.volume = Number(document.getElementById("volumeRange").value);
	backgroundWin.preference.resetCounter = document.getElementById("resetCounter").checked;
	backgroundWin.preference.reUseExistingMailTab = document.getElementById("reUseExistingMailTab").checked;
	if (document.getElementById("openEmailInCurrentTab").checked) {
		backgroundWin.preference.openBehavior = 0;
	} else if (document.getElementById("openEmailInNewTab").checked) {
		backgroundWin.preference.openBehavior = 1;
	} else {
		backgroundWin.preference.openBehavior = 2;
	}
	backgroundWin.preference.multipleSignIn = document.getElementById("multipleSignIn").checked;
	backgroundWin.preference.MSIopenBehavior = Number(document.getElementById("MSIopenBehavior").selectedIndex);
	backgroundWin.preference.feedEnhance = document.getElementById("feedEnhance").checked;
	backgroundWin.preference.snippetTooltipShow = Number(document.getElementById("snippetTooltipShow").selectedIndex);
	backgroundWin.preference.snippetNotificationShow = Number(document.getElementById("snippetNotificationShow").selectedIndex);
	var img = new Image();
	img.addEventListener("load", function(event) {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", 80);
		canvas.setAttribute("height", 80);
		var ctx = canvas.getContext("2d");
		ctx.clearRect (0, 0, 80, 80);
		ctx.drawImage(event.target, 0, 0, 80, 80);
		var c80 = ctx.getImageData(0, 0, 80, 80);
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", 195);
		canvas.setAttribute("height", 80);
		var ctx = canvas.getContext("2d");
		ctx.clearRect (0, 0, 195, 80);
		ctx.putImageData(c80, 0, 0);
		backgroundWin.preference.defaultToolbarIcon = document.getElementById("defaultToolbarIcon").checked;
		backgroundWin.preference.defaultInactiveIcon = document.getElementById("defaultInactiveIcon").checked;
		if (document.getElementById("defaultToolbarIcon").checked) {
			backgroundWin.c19 = c19default;
			backgroundWin.c38 = c38default;
			ctx.putImageData(c19default, 118, 0);
			ctx.putImageData(c38default, 80, 0);
		} else {
			backgroundWin.c19 = c19;
			backgroundWin.c38 = c38;
			ctx.putImageData(c19, 118, 0);
			ctx.putImageData(c38, 80, 0);
		}
		if (document.getElementById("defaultInactiveIcon").checked) {
			backgroundWin.g19 = g19default;
			backgroundWin.g38 = g38default;
			ctx.putImageData(g19default, 175, 0);
			ctx.putImageData(g38default, 137, 0);
		} else {
			backgroundWin.g19 = g19;
			backgroundWin.g38 = g38;
			ctx.putImageData(g19, 175, 0);
			ctx.putImageData(g38, 137, 0);
		}
		if (document.getElementById("defaultBadgeBackgroundColor").checked) {
			backgroundWin.badgeBackgroundColor = [0, 0, 0, 0];
		} else {
			backgroundWin.badgeBackgroundColor = [Number(document.getElementById("red").value), Number(document.getElementById("green").value), Number(document.getElementById("blue").value), 255];
			var c1 = ctx.getImageData(194, 0, 1, 1);
			c1.data[0] = Number(document.getElementById("red").value);
			c1.data[1] = Number(document.getElementById("green").value);
			c1.data[2] = Number(document.getElementById("blue").value);
			c1.data[3] = 255;
			ctx.putImageData(c1, 194, 0);
		}
		backgroundWin.preference.blackBox = document.getElementById("blackBox").checked;
		if (document.getElementById("defaultToolbarIcon").checked) {
			if (document.getElementById("defaultInactiveIcon").checked) {
				if (document.getElementById("defaultBadgeBackgroundColor").checked) {
					backgroundWin.newPreference("default.png");
					return;
				}
			}
		}
		var imgDataURL = canvas.toDataURL("image/png", "");
		backgroundWin.newPreference(imgDataURL);
	});
	if (document.getElementById("defaultNotificationIcon").checked) {
		backgroundWin.notificationIcon = c80default;
		img.src = c80default;
	} else {
		backgroundWin.notificationIcon = notificationIcon;
		img.src = notificationIcon;
	}
}
function resizeDiv() {
	var rect = document.getElementById("mainBox").getBoundingClientRect();
	var newHeight = window.innerHeight - rect.top - 20;
	if (newHeight < 200) {newHeight = 200;}
	document.getElementById("mainBox").style.height = newHeight.toString() + "px";
	var newWidth = window.innerWidth - rect.left - 15;
	if (newWidth < 200) {newWidth = 200;}
	document.getElementById("mainBox").style.width = newWidth.toString() + "px";
}
function changeInterval() {
	var newInterval = Number(document.getElementById("autoCheckRange").value);
	var autoCheckText = newInterval.toString() + " minute";
	if (newInterval === maxAutoCheckRange) {
		var autoCheckText = "Never";
	} else if (newInterval > 119) {
		var autoCheckText = Math.floor(newInterval / 60).toString() + " hours";
		newInterval = (newInterval % 60);
		if (newInterval !== 0) {
			autoCheckText += " " + newInterval.toString() + " minute";
			if (newInterval > 1) {
				autoCheckText += "s";
			}
		}
	} else if (newInterval > 59) {
		newInterval = (newInterval % 60);
		var autoCheckText = "1 hour";
		if (newInterval !== 0) {
			autoCheckText += " " + newInterval.toString() + " minute";
			if (newInterval > 1) {
				autoCheckText += "s";
			}
		}
	} else if (newInterval > 1) {
		var autoCheckText = newInterval.toString() + " minutes";
	} else {
		var autoCheckText = "1 minute";
	}
	var autoCheckTextElement = document.getElementById("autoCheckText");
	autoCheckTextElement.removeChild(autoCheckTextElement.childNodes[0]);
	autoCheckTextElement.appendChild(document.createTextNode(autoCheckText));
}
function changeDelayFirstChecking() {
	var newDelayFirstChecking = Number(document.getElementById("delayFirstCheckingRange").value);
	if (newDelayFirstChecking === 120) {
		var delayFirstCheckingText = "2 minutes";
	} else if (newDelayFirstChecking > 61) {
		var delayFirstCheckingText = "1 minute " + (newDelayFirstChecking - 60).toString() + " seconds";
	} else if (newDelayFirstChecking > 60) {
		var delayFirstCheckingText = "1 minute 1 second";
	} else if (newDelayFirstChecking === 60) {
		var delayFirstCheckingText = "1 minute";
	} else if (newDelayFirstChecking > 1) {
		var delayFirstCheckingText = newDelayFirstChecking.toString() + " seconds";
	} else if (newDelayFirstChecking === 1) {
		var delayFirstCheckingText = "1 second";
	} else {
		var delayFirstCheckingText = "No delay";
	}
	var delayFirstCheckingTextElement = document.getElementById("delayFirstCheckingText");
	delayFirstCheckingTextElement.removeChild(delayFirstCheckingTextElement.childNodes[0]);
	delayFirstCheckingTextElement.appendChild(document.createTextNode(delayFirstCheckingText));
}
function changeVolume() {
	var volumeText = "Volume "+document.getElementById("volumeRange").value + "%";
	var volumeTextElement = document.getElementById("volumeText");
	volumeTextElement.removeChild(volumeTextElement.childNodes[0]);
	volumeTextElement.appendChild(document.createTextNode(volumeText));
	if (document.getElementById("testSound").value !== "Test") {
		audio.volume = Number(document.getElementById("volumeRange").value) / 100;
	}
}
function pauseSound() {
	try {
		audio.pause();
		audio.src = "";
		audio = null;
	} catch(e) {
	}
	document.getElementById("testSound").value = "Test";
}
function testSound() {
	try {
		audio.pause();
		audio.src = "";
		audio = null;
	} catch(e) {
	}
	if (document.getElementById("testSound").value === "Test") {
		audio = document.createElement("audio");
		audio.volume = Number(document.getElementById("volumeRange").value) / 100;
		audio.addEventListener("ended", function(event) {
			audio.src = "";
			audio = null;
			document.getElementById("testSound").value = "Test";
		});
		audio.addEventListener("error", function(event) {
			try {
				audio.src = "";
			} catch(e) {
			}
			audio = null;
			document.getElementById("testSound").value = "Test";
		});
		audio.addEventListener("play", function(event) {
			document.getElementById("testSound").value = "Stop";
		});
		if (document.getElementById("defaultSound").checked) {
			audio.src = "default.wav";
		} else {
			audio.src = soundFile;
		}
		document.getElementById("testSound").value = "Loading";
		audio.play();
	}
}
function loadSound(event) {
	pauseSound();
	var soundSource = event.target.files[0];
	if (typeof soundSource !== "undefined") {
		var reader = new FileReader();
		reader.addEventListener("loadend", function(event) {
			soundFile = event.target.result;
			soundFileName = event.target.id;
			document.getElementById("customSound").removeAttribute("disabled");
			document.getElementById("customSound").checked = true;
			document.getElementById("defaultSound").checked = false;
			setSoundFileName();
			document.getElementById("save").removeAttribute("disabled");
		});
		reader.id = document.getElementById("loadSoundInput").value.split("\\")[2];
		reader.readAsDataURL(soundSource);
	}
}
function setSoundFileName() {
	var soundFileNameElement = document.getElementById("soundFileName");
	soundFileNameElement.removeAttribute("title");
	if (soundFileName !== "") {
		soundFileNameElement.setAttribute("title", soundFileName);
		soundFileNameElement.removeChild(soundFileNameElement.childNodes[0]);
		if (soundFileName.length > 23) {
			soundFileNameElement.appendChild(document.createTextNode(soundFileName.substr(0,10)+"..."+soundFileName.substr(-10)));
		} else {
			soundFileNameElement.appendChild(document.createTextNode(soundFileName));
		}
	}
}
function loadNotificationIcon(event) {
	var notificationIconSource = event.target.files[0];
	if (typeof notificationIconSource !== "undefined") {
		var reader = new FileReader();
		reader.addEventListener("loadend", function(event) {
			var newNotificationIcon = event.target.result;
			var img = new Image();
			img.addEventListener("load", function(event) {
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth > 80) || (imgHeight > 80)) {
					var resizeRatio = 80 / (Math.max(imgWidth, imgHeight));
					imgWidth = Math.max(1, Math.round(imgWidth * resizeRatio));
					imgHeight = Math.max(1, Math.round(imgHeight * resizeRatio));
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 80);
				canvas.setAttribute("height", 80);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 80, 80);
				ctx.drawImage(img, Math.ceil((80-imgWidth)/2), Math.ceil((80-imgHeight)/2), imgWidth, imgHeight);
				notificationIcon = canvas.toDataURL("image/png", "");
				ctx = null;
				canvas = null;
				document.getElementById("customNotificationIcon").removeAttribute("disabled");
				document.getElementById("customNotificationIcon").checked = true;
				document.getElementById("defaultNotificationIcon").checked = false;
				document.getElementById("imgNotificationIcon").src = notificationIcon;
				document.getElementById("save").removeAttribute("disabled");
			});
			img.src = newNotificationIcon;
		});
		reader.readAsDataURL(notificationIconSource);
	}
}
function showImageData(id, imgData) {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", imgData.width);
	canvas.setAttribute("height", imgData.height);
	canvas.getContext("2d").putImageData(imgData, 0, 0);
	var imgDataURL = canvas.toDataURL("image/png", "");
	document.getElementById(id).src = canvas.toDataURL("image/png", "");
	canvas = null;
}
function loadToolbarIcon(event) {
	var toolbarIconSource = event.target.files[0];
	if (typeof toolbarIconSource !== "undefined") {
		var reader = new FileReader();
		reader.addEventListener("loadend", function(event) {
			var newToolbarIcon = event.target.result;
			var img = new Image();
			img.addEventListener("load", function(event) {
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth > 19) || (imgHeight > 19)) {
					var resizeRatio = 19 / (Math.max(imgWidth, imgHeight));
					imgWidth = Math.max(1, Math.round(imgWidth * resizeRatio));
					imgHeight = Math.max(1, Math.round(imgHeight * resizeRatio));
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 19);
				canvas.setAttribute("height", 19);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 19, 19);
				ctx.drawImage(img, Math.ceil((19-imgWidth)/2), Math.ceil((19-imgHeight)/2), imgWidth, imgHeight);
				c19 = ctx.getImageData(0, 0, 19, 19);
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth > 38) || (imgHeight > 38)) {
					var resizeRatio = 38 / (Math.max(imgWidth, imgHeight));
					imgWidth = Math.max(1, Math.round(imgWidth * resizeRatio));
					imgHeight = Math.max(1, Math.round(imgHeight * resizeRatio));
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 38);
				canvas.setAttribute("height", 38);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 38, 38);
				ctx.drawImage(img, Math.ceil((38-imgWidth)/2), Math.ceil((38-imgHeight)/2), imgWidth, imgHeight);
				c38 = ctx.getImageData(0, 0, 38, 38);
				ctx = null;
				canvas = null;
				document.getElementById("customToolbarIcon").removeAttribute("disabled");
				document.getElementById("customToolbarIcon").checked = true;
				document.getElementById("defaultToolbarIcon").checked = false;
				showImageData("imgToolbarIcon19", c19);
				showImageData("imgToolbarIcon38", c38);
				document.getElementById("save").removeAttribute("disabled");
			});
			img.src = newToolbarIcon;
		});
		reader.readAsDataURL(toolbarIconSource);
	}
}
function loadInactiveIcon(event) {
	var inactiveIconSource = event.target.files[0];
	if (typeof inactiveIconSource !== "undefined") {
		var reader = new FileReader();
		reader.addEventListener("loadend", function(event) {
			var newInactiveIcon = event.target.result;
			var img = new Image();
			img.addEventListener("load", function(event) {
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth > 19) || (imgHeight > 19)) {
					var resizeRatio = 19 / (Math.max(imgWidth, imgHeight));
					imgWidth = Math.max(1, Math.round(imgWidth * resizeRatio));
					imgHeight = Math.max(1, Math.round(imgHeight * resizeRatio));
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 19);
				canvas.setAttribute("height", 19);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 19, 19);
				ctx.drawImage(img, Math.ceil((19-imgWidth)/2), Math.ceil((19-imgHeight)/2), imgWidth, imgHeight);
				g19 = ctx.getImageData(0, 0, 19, 19);
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth > 38) || (imgHeight > 38)) {
					var resizeRatio = 38 / (Math.max(imgWidth, imgHeight));
					imgWidth = Math.max(1, Math.round(imgWidth * resizeRatio));
					imgHeight = Math.max(1, Math.round(imgHeight * resizeRatio));
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 38);
				canvas.setAttribute("height", 38);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 38, 38);
				ctx.drawImage(img, Math.ceil((38-imgWidth)/2), Math.ceil((38-imgHeight)/2), imgWidth, imgHeight);
				g38 = ctx.getImageData(0, 0, 38, 38);
				ctx = null;
				canvas = null;
				document.getElementById("customInactiveIcon").removeAttribute("disabled");
				document.getElementById("customInactiveIcon").checked = true;
				document.getElementById("defaultInactiveIcon").checked = false;
				showImageData("imgInactiveIcon19", g19);
				showImageData("imgInactiveIcon38", g38);
				document.getElementById("save").removeAttribute("disabled");
			});
			img.src = newInactiveIcon;
		});
		reader.readAsDataURL(inactiveIconSource);
	}
}
function createGrayInactiveIcon() {
	var c19Current = c19;
	var c38Current = c38;
	if (document.getElementById("defaultToolbarIcon").checked) {
		c19Current = c19default;
		c38Current = c38default;
	}
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", 38);
	canvas.setAttribute("height", 38);
	var ctx = canvas.getContext("2d");
	g19 = ctx.createImageData(19, 19);
	var isGray = true;
	for (var i = 0; i < (19 * 19); i++) {
		if (c19Current.data[(i * 4) + 3] !== 0) {
			if (c19Current.data[(i * 4)] !== c19Current.data[(i * 4) + 1]) { isGray = false; break; }
			if (c19Current.data[(i * 4)] !== c19Current.data[(i * 4) + 2]) { isGray = false; break; }
		}
	}
	if (isGray) {
		g19 = c19Current;
	} else {
		for (var i = 0; i < (19 * 19); i++) {
			var gray = Math.round((0.21 * c19Current.data[(i * 4)]) + (0.72 * c19Current.data[(i * 4) + 1]) + (0.07 * c19Current.data[(i * 4) + 2]));
			g19.data[(i * 4)] = gray;
			g19.data[(i * 4) + 1] = gray;
			g19.data[(i * 4) + 2] = gray;
			g19.data[(i * 4) + 3] = c19Current.data[(i * 4) + 3];
		}
	}
	g38 = ctx.createImageData(38, 38);
	var isGray = true;
	for (var i = 0; i < (38 * 38); i++) {
		if (c38Current.data[(i * 4) + 3] !== 0) {
			if (c38Current.data[(i * 4)] !== c38Current.data[(i * 4) + 1]) { isGray = false; break; }
			if (c38Current.data[(i * 4)] !== c38Current.data[(i * 4) + 2]) { isGray = false; break; }
		}
	}
	if (isGray) {
		g38 = c38Current;
	} else {
		for (var i=0; i < (38 * 38); i++) {
			var gray = Math.round((0.21 * c38Current.data[(i * 4)]) + (0.72 * c38Current.data[(i * 4) + 1]) + (0.07 * c38Current.data[(i * 4) + 2]));
			g38.data[(i * 4)] = gray;
			g38.data[(i * 4) + 1] = gray;
			g38.data[(i * 4) + 2] = gray;
			g38.data[(i * 4) + 3] = c38Current.data[(i * 4) + 3];
		}
	}
	ctx = null;
	canvas = null;
	document.getElementById("defaultInactiveIcon").checked = false;
	document.getElementById("customInactiveIcon").checked = true;
	document.getElementById("customInactiveIcon").removeAttribute("disabled");
	showImageData("imgInactiveIcon19", g19);
	showImageData("imgInactiveIcon38", g38);
}
function showBadgeBackgroundColor() {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", 50);
	canvas.setAttribute("height", 50);
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 50, 50);
	var imgData = ctx.getImageData(0, 0, 50, 50);
	var a = 255;
	var red = Number(document.getElementById("red").value);
	var green = Number(document.getElementById("green").value);
	var blue = Number(document.getElementById("blue").value);
	document.getElementById("redValue").innerText = red;
	document.getElementById("greenValue").innerText = green;
	document.getElementById("blueValue").innerText = blue;
	if (document.getElementById("defaultBadgeBackgroundColor").checked) {
		a = 0;
		red = 0;
		green = 0;
		blue = 0;
	}
	for (var i = 0; i < 2500; i++) {
		imgData.data[(i * 4)] = red;
		imgData.data[(i * 4) + 1] = green;
		imgData.data[(i * 4) + 2] = blue;
		imgData.data[(i * 4) + 3] = a;
	}
	ctx.putImageData(imgData, 0, 0);
	document.getElementById("imgBadgeBackgroundColor").src = canvas.toDataURL("image/png", "");
	ctx = null;
	canvas = null;
}
function loadSkin(event) {
	var loadSkinSource = event.target.files[0];
	if (typeof loadSkinSource !== "undefined") {
		var reader = new FileReader();
		reader.addEventListener("loadend", function(event) {
			var skinDataURL = event.target.result;
			var img = new Image();
			img.addEventListener("abort", function(event) {
				alert("Skin loading abort");
			});
			img.addEventListener("error", function(event) {
				alert("Skin loading error");
			});
			img.addEventListener("load", function(event) {
				var imgWidth = event.target.width;
				var imgHeight = event.target.height;
				if ((imgWidth !== 195) || (imgHeight !== 80)) {
					alert("Skin file error");
					return;
				}
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 195);
				canvas.setAttribute("height", 80);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 195, 80);
				ctx.drawImage(img, 0, 0, 195, 80);
				c38 = ctx.getImageData(80, 0, 38, 38);
				c19 = ctx.getImageData(118, 0, 19, 19);
				g38 = ctx.getImageData(137, 0, 38, 38);
				g19 = ctx.getImageData(175, 0, 19, 19);
				document.getElementById("defaultToolbarIcon").checked = false;
				document.getElementById("customToolbarIcon").checked = true;
				document.getElementById("customToolbarIcon").removeAttribute("disabled");
				document.getElementById("defaultInactiveIcon").checked = false;
				document.getElementById("customInactiveIcon").checked = true;
				document.getElementById("customInactiveIcon").removeAttribute("disabled");
				showImageData("imgToolbarIcon19", c19);
				showImageData("imgToolbarIcon38", c38);
				showImageData("imgInactiveIcon19", g19);
				showImageData("imgInactiveIcon38", g38);
				var bgImgData = ctx.getImageData(194, 0, 1, 1);
				if (bgImgData.data[3] === 0) {
					document.getElementById("defaultBadgeBackgroundColor").checked = true;
					document.getElementById("customBadgeBackgroundColor").checked = false;
				} else {
					document.getElementById("defaultBadgeBackgroundColor").checked = false;
					document.getElementById("customBadgeBackgroundColor").checked = true;
					document.getElementById("red").value = bgImgData.data[0];
					document.getElementById("green").value = bgImgData.data[1];
					document.getElementById("blue").value = bgImgData.data[2];
				}
				showBadgeBackgroundColor()
				var c80 = ctx.getImageData(0, 0, 80, 80);
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width", 80);
				canvas.setAttribute("height", 80);
				var ctx = canvas.getContext("2d");
				ctx.clearRect (0, 0, 80, 80);
				ctx.putImageData(c80, 0, 0);
				notificationIcon = canvas.toDataURL("image/png", "");
				document.getElementById("defaultNotificationIcon").checked = false;
				document.getElementById("customNotificationIcon").checked = true;
				document.getElementById("customNotificationIcon").removeAttribute("disabled");
				document.getElementById("imgNotificationIcon").src = notificationIcon;
				ctx = null;
				canvas = null;
				document.getElementById("save").removeAttribute("disabled");
			});
			img.src = skinDataURL;
		});
		reader.readAsDataURL(loadSkinSource);
	}
}
function exportSkin() {
	var img = new Image();
	img.addEventListener("load", function(event) {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", 80);
		canvas.setAttribute("height", 80);
		var ctx = canvas.getContext("2d");
		ctx.clearRect (0, 0, 80, 80);
		ctx.drawImage(event.target, 0, 0, 80, 80);
		var c80 = ctx.getImageData(0, 0, 80, 80);
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", 195);
		canvas.setAttribute("height", 80);
		var ctx = canvas.getContext("2d");
		ctx.clearRect (0, 0, 195, 80);
		ctx.putImageData(c80, 0, 0);
		if (document.getElementById("defaultToolbarIcon").checked) {
			ctx.putImageData(c38default, 80, 0);
			ctx.putImageData(c19default, 118, 0);
		} else {
			ctx.putImageData(c38, 80, 0);
			ctx.putImageData(c19, 118, 0);
		}
		if (document.getElementById("defaultInactiveIcon").checked) {
			ctx.putImageData(g38default, 137, 0);
			ctx.putImageData(g19default, 175, 0);
		} else {
			ctx.putImageData(g38, 137, 0);
			ctx.putImageData(g19, 175, 0);
		}
		if (document.getElementById("customBadgeBackgroundColor").checked) {
			var c1 = ctx.getImageData(194, 0, 1, 1);
			c1.data[0] = Number(document.getElementById("red").value);
			c1.data[1] = Number(document.getElementById("green").value);
			c1.data[2] = Number(document.getElementById("blue").value);
			c1.data[3] = 255;
			ctx.putImageData(c1, 194, 0);
		}
		var imgDataURL = canvas.toDataURL("image/png", "");
		var byteString = atob(imgDataURL.split(",")[1]);
		var tempArray = [];
		for (var i=0; i < byteString.length; i++) {
			tempArray.push(byteString.charCodeAt(i));
		}
		var blob = new Blob([new Uint8Array(tempArray)], {type:"image/png"});
		var saveAsInput = document.getElementById("saveAs");
		saveAsInput.download = "skin.png";
		saveAsInput.href = window.webkitURL.createObjectURL(blob);
		saveAsInput.click();
	});
	if (document.getElementById("defaultNotificationIcon").checked) {
		img.src = c80default;
	} else {
		img.src = notificationIcon;
	}
}


//================================================
// Begin here
//================================================
document.addEventListener("DOMContentLoaded", function() {
	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		backgroundWin = backgroundPage;
		var img = new Image();
		img.addEventListener("load", function(event) {
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", 195);
			canvas.setAttribute("height", 80);
			var ctx = canvas.getContext("2d");
			ctx.clearRect (0, 0, 195, 80);
			ctx.drawImage(event.target, 0, 0, 195, 80);
			c38default = ctx.getImageData(80, 0, 38, 38);
			c19default = ctx.getImageData(118, 0, 19, 19);
			g38default = ctx.getImageData(137, 0, 38, 38);
			g19default = ctx.getImageData(175, 0, 19, 19);
			var c80 = ctx.getImageData(0, 0, 80, 80);
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", 80);
			canvas.setAttribute("height", 80);
			var ctx = canvas.getContext("2d");
			ctx.clearRect (0, 0, 80, 80);
			ctx.putImageData(c80, 0, 0);
			c80default = canvas.toDataURL("image/png", "");
			ctx = null;
			canvas = null;
			document.getElementById("name").innerText = chrome.i18n.getMessage("name");
			if (chrome.extension.inIncognitoContext) {
				document.getElementById("save").setAttribute("value", "Set");
				document.getElementById("incognitoWarn").style.display = "block";
			}
			if (backgroundWin.siteSupport) {
				document.getElementById("site").style.display = "table-row";
				document.getElementById("site" + backgroundWin.preference.site.toString()).checked = true;
				for (var i = 0; i < backgroundWin.siteCount; i++) {
					document.getElementById("fontSite" + i.toString()).innerText = "  " + backgroundWin.siteName[i];
				}
			}
			document.getElementById("inbox").checked = backgroundWin.preference.inbox;
			document.getElementById("newlyArrived").checked = backgroundWin.preference.newlyArrived;
			var interval = backgroundWin.preference.interval;
			if (interval === 0x7FFFFFFF) {
				document.getElementById("autoCheckRange").value = maxAutoCheckRange;
			} else {
				document.getElementById("autoCheckRange").value = interval;
			}
			changeInterval();
			document.getElementById("delayFirstCheckingRange").value = backgroundWin.preference.delayFirstChecking;
			changeDelayFirstChecking();
			if (backgroundWin.feedSupport) {
				document.getElementById("suggestFeed").style.display = "block";
			}
			document.getElementById("showToolbarNumber").checked = backgroundWin.preference.showToolbarNumber;
			document.getElementById("disabledLoadingIcon").checked = backgroundWin.preference.disabledLoadingIcon;
			if (backgroundWin.preference.popup === "popup.xhtml") {
				document.getElementById("showPopup").checked = true;
			} else {
				document.getElementById("noPopup").checked = true;
			}
			document.getElementById("sound").checked = backgroundWin.preference.sound;
			document.getElementById("display").checked = backgroundWin.preference.display;
			document.getElementById("blink").checked = backgroundWin.preference.blink;
			soundFile = backgroundWin.soundFile;
			if (soundFile === "default.wav") {
				document.getElementById("defaultSound").checked = true;
				soundFile = "";
				soundFileName = "";
				document.getElementById("customSound").setAttribute("disabled", "disabled");
			} else {
				document.getElementById("customSound").checked = true;
				soundFileName = backgroundWin.preference.soundFileName;
			}
			setSoundFileName();
			document.getElementById("volumeRange").value = backgroundWin.preference.volume;
			changeVolume();
			document.getElementById("resetCounter").checked = backgroundWin.preference.resetCounter;
			document.getElementById("reUseExistingMailTab").checked = backgroundWin.preference.reUseExistingMailTab;
			if (backgroundWin.preference.openBehavior === 0) {
				document.getElementById("openEmailInCurrentTab").checked = true;
			} else if (backgroundWin.preference.openBehavior === 1) {
				document.getElementById("openEmailInNewTab").checked = true;
			} else {
				document.getElementById("openEmailInNewBackgroundTab").checked = true;
			}
			if (backgroundWin.MSISupport) {
				document.getElementById("MSI").style.display = "table-row";
				if (backgroundWin.preference.multipleSignIn) {
					document.getElementById("multipleSignIn").checked = true;
					document.getElementById("reUseExistingMailTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInCurrentTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInNewTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInNewBackgroundTab").setAttribute("disabled", "disabled");
				} else {
					document.getElementById("MSIopenBehavior").setAttribute("disabled", "disabled");
				}
				document.getElementById("MSIopenBehavior").selectedIndex = backgroundWin.preference.MSIopenBehavior;
			}
			if (backgroundWin.feedSupport) {
				document.getElementById("feed").style.display = "table-row";
				if (backgroundWin.preference.feedEnhance) {
					document.getElementById("feedEnhance").checked = true;
				} else {
					document.getElementById("snippetTooltipShow").setAttribute("disabled", "disabled");
					document.getElementById("snippetNotificationShow").setAttribute("disabled", "disabled");
				}
				document.getElementById("snippetTooltipShow").selectedIndex = backgroundWin.preference.snippetTooltipShow;
				document.getElementById("snippetNotificationShow").selectedIndex = backgroundWin.preference.snippetNotificationShow;
			}
			notificationIcon = backgroundWin.notificationIcon;
			if (notificationIcon === c80default) {
				document.getElementById("defaultNotificationIcon").checked = true;
				document.getElementById("customNotificationIcon").setAttribute("disabled", "disabled");
			} else {
				document.getElementById("customNotificationIcon").checked = true;
			}
			document.getElementById("imgNotificationIcon").src = notificationIcon;
			if (backgroundWin.preference.defaultToolbarIcon) {
				document.getElementById("defaultToolbarIcon").checked = true;
				document.getElementById("customToolbarIcon").setAttribute("disabled", "disabled");
			} else {
				document.getElementById("customToolbarIcon").checked = true;
			}
			c19 = backgroundWin.c19;
			c38 = backgroundWin.c38;
			showImageData("imgToolbarIcon19", c19);
			showImageData("imgToolbarIcon38", c38);
			if (backgroundWin.preference.defaultInactiveIcon) {
				document.getElementById("defaultInactiveIcon").checked = true;
				document.getElementById("customInactiveIcon").setAttribute("disabled", "disabled");
			} else {
				document.getElementById("customInactiveIcon").checked = true;
			}
			g19 = backgroundWin.g19;
			g38 = backgroundWin.g38;
			showImageData("imgInactiveIcon19", g19);
			showImageData("imgInactiveIcon38", g38);
			if (backgroundWin.badgeBackgroundColor[3] === 0) {
				document.getElementById("defaultBadgeBackgroundColor").checked = true;
			} else {
				document.getElementById("customBadgeBackgroundColor").checked = true;
			}
			document.getElementById("red").value = backgroundWin.badgeBackgroundColor[0];
			document.getElementById("green").value = backgroundWin.badgeBackgroundColor[1];
			document.getElementById("blue").value = backgroundWin.badgeBackgroundColor[2];
			showBadgeBackgroundColor();
			if (backgroundWin.preference.blackBox) {
				document.getElementById("blackBox").checked = true;
				document.getElementById("blackBoxTextArea").innerText = backgroundWin.logEncrypt;
			}
			document.getElementById("blackBoxTextArea").innerText = backgroundWin.logEncrypt;
			if (backgroundWin.siteSupport) {
				for (var i = 0; i < backgroundWin.siteCount; i++) {
					document.getElementById("site" + i.toString()).addEventListener("click", function(event) {
						document.getElementById("save").removeAttribute("disabled");
					});
				}
			}
			document.getElementById("save").addEventListener("click", function(event) {
				saveAll();
				document.getElementById("save").setAttribute("disabled", "disabled");
			});
			document.getElementById("about").addEventListener("click", function(event) {
				chrome.windows.create({url:"about.xhtml", width: 750, height: 475, focused: true, type:"popup"});
			});
			document.getElementById("inbox").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("newlyArrived").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("autoCheckRange").addEventListener("input", function(event) {
				changeInterval();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("autoCheckRange").focus();}, 0);
			});
			document.getElementById("autoCheckRange").addEventListener("change", function(event) {
				changeInterval();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("autoCheckRange").focus();}, 0);
			});
			document.getElementById("delayFirstCheckingRange").addEventListener("input", function(event) {
				changeDelayFirstChecking();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("delayFirstCheckingRange").focus();}, 0);
			});
			document.getElementById("delayFirstCheckingRange").addEventListener("change", function(event) {
				changeDelayFirstChecking();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("delayFirstCheckingRange").focus();}, 0);
			});
			document.getElementById("showToolbarNumber").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("disabledLoadingIcon").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("showPopup").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("noPopup").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("sound").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("display").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("blink").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("defaultSound").addEventListener("change", function(event) {
				pauseSound();
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("customSound").addEventListener("change", function(event) {
				pauseSound();
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("volumeRange").addEventListener("input", function(event) {
				changeVolume();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("volumeRange").focus();}, 0);
			});
			document.getElementById("volumeRange").addEventListener("change", function(event) {
				changeVolume();
				document.getElementById("save").removeAttribute("disabled");
				window.setTimeout(function() {document.getElementById("volumeRange").focus();}, 0);
			});
			document.getElementById("testSound").addEventListener("click", function(event) {
				testSound();
			});
			document.getElementById("loadSound").addEventListener("click", function(event) {
				document.getElementById("loadSoundInput").click();
			});
			document.getElementById("loadSoundInput").addEventListener("change", function(event) {
				loadSound(event);
			});
			document.getElementById("resetCounter").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("reUseExistingMailTab").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("openEmailInCurrentTab").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("openEmailInNewTab").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("openEmailInNewBackgroundTab").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("multipleSignIn").addEventListener("click", function(event) {
				if (document.getElementById("multipleSignIn").checked) {
					document.getElementById("MSIopenBehavior").removeAttribute("disabled");
					document.getElementById("reUseExistingMailTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInCurrentTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInNewTab").setAttribute("disabled", "disabled");
					document.getElementById("openEmailInNewBackgroundTab").setAttribute("disabled", "disabled");
				} else {
					document.getElementById("MSIopenBehavior").setAttribute("disabled", "disabled");
					document.getElementById("reUseExistingMailTab").removeAttribute("disabled");
					document.getElementById("openEmailInCurrentTab").removeAttribute("disabled");
					document.getElementById("openEmailInNewTab").removeAttribute("disabled");
					document.getElementById("openEmailInNewBackgroundTab").removeAttribute("disabled");
				}
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("MSIopenBehavior").addEventListener("change", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("feedEnhance").addEventListener("click", function(event) {
				if (document.getElementById("feedEnhance").checked) {
					document.getElementById("snippetTooltipShow").removeAttribute("disabled");
					document.getElementById("snippetNotificationShow").removeAttribute("disabled");
				} else {
					document.getElementById("snippetTooltipShow").setAttribute("disabled", "disabled");
					document.getElementById("snippetNotificationShow").setAttribute("disabled", "disabled");
				}
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("snippetTooltipShow").addEventListener("change", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("snippetNotificationShow").addEventListener("change", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("showHideSkinSetting").addEventListener("click", function(event) {
				var showHideButton = document.getElementById("showHideSkinSetting");
				if (document.getElementById("skinSettingTable").style.display === "none") {
					document.getElementById("skinSettingTable").style.display = "table";
					showHideButton.removeChild(showHideButton.childNodes[0]);
					showHideButton.appendChild(document.createTextNode("Hide Skin Setting"));
					document.getElementById("mainBox").scrollTop = document.getElementById("mainBox").scrollTop + 200;
				} else {
					document.getElementById("skinSettingTable").style.display = "none";
					showHideButton.removeChild(showHideButton.childNodes[0]);
					showHideButton.appendChild(document.createTextNode("Show Skin Setting"));
				}
			});
			document.getElementById("importSkin").addEventListener("click", function(event) {
				document.getElementById("loadSkin").click();
			});
			document.getElementById("loadSkin").addEventListener("change", function(event) {
				loadSkin(event);
			});
			document.getElementById("exportSkin").addEventListener("click", function(event) {
				exportSkin();
			});
			document.getElementById("defaultNotificationIcon").addEventListener("change", function(event) {
				document.getElementById("imgNotificationIcon").src = c80default;
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("customNotificationIcon").addEventListener("change", function(event) {
				document.getElementById("imgNotificationIcon").src = notificationIcon;
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("changeNotificationIcon").addEventListener("click", function(event) {
				document.getElementById("loadNotificationIcon").click();
			});
			document.getElementById("loadNotificationIcon").addEventListener("change", function(event) {
				loadNotificationIcon(event);
			});
			document.getElementById("defaultToolbarIcon").addEventListener("change", function(event) {
				showImageData("imgToolbarIcon19", c19default);
				showImageData("imgToolbarIcon38", c38default);
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("customToolbarIcon").addEventListener("change", function(event) {
				showImageData("imgToolbarIcon19", c19);
				showImageData("imgToolbarIcon38", c38);
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("changeToolbarIcon").addEventListener("click", function(event) {
				document.getElementById("loadToolbarIcon").click();
			});
			document.getElementById("loadToolbarIcon").addEventListener("change", function(event) {
				loadToolbarIcon(event);
			});
			document.getElementById("defaultInactiveIcon").addEventListener("change", function(event) {
				showImageData("imgInactiveIcon19", g19default);
				showImageData("imgInactiveIcon38", g38default);
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("customInactiveIcon").addEventListener("change", function(event) {
				showImageData("imgInactiveIcon19", g19);
				showImageData("imgInactiveIcon38", g38);
				document.getElementById("save").removeAttribute("disabled");
			});
			document.getElementById("createGray").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
				createGrayInactiveIcon();
			});
			document.getElementById("changeInactiveIcon").addEventListener("click", function(event) {
				document.getElementById("loadInactiveIcon").click();
			});
			document.getElementById("loadInactiveIcon").addEventListener("change", function(event) {
				loadInactiveIcon(event);
			});
			document.getElementById("defaultBadgeBackgroundColor").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
			});
			document.getElementById("customBadgeBackgroundColor").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
			});
			document.getElementById("red").addEventListener("input", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("red").focus();}, 0);
			});
			document.getElementById("red").addEventListener("change", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("red").focus();}, 0);
			});
			document.getElementById("green").addEventListener("input", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("green").focus();}, 0);
			});
			document.getElementById("green").addEventListener("change", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("green").focus();}, 0);
			});
			document.getElementById("blue").addEventListener("input", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("blue").focus();}, 0);
			});
			document.getElementById("blue").addEventListener("change", function(event) {
				document.getElementById("customBadgeBackgroundColor").checked = true;
				document.getElementById("save").removeAttribute("disabled");
				showBadgeBackgroundColor();
				window.setTimeout(function() {document.getElementById("blue").focus();}, 0);
			});
			document.getElementById("showHideAdvancedSetting").addEventListener("click", function(event) {
				var showHideButton = document.getElementById("showHideAdvancedSetting");
				if (document.getElementById("advanceSettingTable").style.display === "none") {
					document.getElementById("advanceSettingTable").style.display = "table";
					showHideButton.removeChild(showHideButton.childNodes[0]);
					showHideButton.appendChild(document.createTextNode("Hide Advanced Setting"));
					document.getElementById("mainBox").scrollTop = document.getElementById("mainBox").scrollTop + 200;
				} else {
					document.getElementById("advanceSettingTable").style.display = "none";
					showHideButton.removeChild(showHideButton.childNodes[0]);
					showHideButton.appendChild(document.createTextNode("Show Advanced Setting"));
				}
			});
			document.getElementById("blackBox").addEventListener("click", function(event) {
				document.getElementById("save").removeAttribute("disabled");
			});
			window.onbeforeunload = function() {
				if (document.getElementById("save").hasAttribute("disabled")) { return; }
				return("Warning. Your new settings are not saved yet.");
			};
			window.addEventListener("load", function(event) {
				resizeDiv();
			});
			window.addEventListener("resize", function(event) {
				resizeDiv();
			});
			resizeDiv();
		});
		img.src = "default.png"
	});
});
window.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
