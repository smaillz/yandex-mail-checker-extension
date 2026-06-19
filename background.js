//================================================================
// Copyright 2017 Sonthakit Leelahanon. All rights reserved.
//================================================================
"use strict";


// Constant
var timeoutForCheckMail = 50000;
var doubleClickInterval = 1000;


// Global
var timerDelayFirstCheck = null;
var timerInterval = null;
var timerTimeout = null;
var timerIcon = null;
var timerMailTab = null;
var timerBrowerAction = null;
var firstClickTime = 0;
var loadingIcon = null;
var loadingIconIndex = 0;
var t19 = null;
var t38 = null;
var c19 = null;
var c38 = null;
var g19 = null;
var g38 = null;
var cTransparent = false;
var	notificationIcon = "default.png";
var badgeBackgroundColor = [0, 0, 0, 0];
var soundFile = null;
var xhr = null;
var audio = null;
var forceNoAlert = null;
var newStatus = null;
var newCounter = null;
var newEmailAddress = null;
var sessionId = 0;
var statusIcon = "G";
var statusAlert = false;
var statusStatus = "Y";
var statusCounter = 0;
var emailAddress = "";
var snippet = [];
var MSIisLeatestData = false;
var preference = {
	site: 0,
	inbox: true,
	newlyArrived: false,
	delayFirstChecking: 0,
	interval: 30,
	popup: "popup.xhtml",
	resetCounter: true,
	sound: false,
	display: true,
	blink: false,
	volume: 100,
	soundFileName: "",
	reUseExistingMailTab: true,
	openBehavior: 1,
	multipleSignIn: false,
	MSIopenBehavior: 1,
	feedEnhance: false,
	snippetTooltipShow: 2,
	snippetNotificationShow: 2,
	defaultToolbarIcon: true,
	defaultInactiveIcon: true,
	disabledLoadingIcon: false,
	showToolbarNumber: true,
	blackBox: false
}


//================================================
// new Preference
//================================================
function newPreference(imgDataURL) {
	if (!chrome.extension.inIncognitoContext) {
		localStorage.preference = JSON.stringify(preference);
		chrome.storage.local.set({soundFile:soundFile});
		localStorage.icon = imgDataURL;
	}
	changeTimer(preference.interval);
	statusAlert = false;
	changeStatus();
}


//================================================
// Status
//================================================
function clearStatus() {
	try {
		audio.pause();
		audio.src = "";
		audio = null;
	} catch(e) {
	}
	chrome.notifications.clear(chrome.i18n.getMessage("name"), function(wasCleared) {});
}
function changeStatus() {
	clearStatus();
	if (statusAlert) {
		if (preference.sound) {
			audio = document.createElement("audio");
			audio.volume = preference.volume / 100;
			audio.addEventListener("ended", function(event) {
				audio.src = "";
				audio = null;
			});
			audio.addEventListener("error", function(event) {
				try {
					audio.src = "";
				} catch(e) {
				}
				audio = null;
			});
			audio.src = soundFile;
			audio.play();
		}
		if (preference.display) {
			if (MSIisLeatestData) {
				MSINotification();
			} else {
				if (snippet.length === 0) {
					var title = chrome.i18n.getMessage("name");
					var message = "You have " + statusCounter + " unread " + chrome.i18n.getMessage("email");
					if (statusCounter > 1) { message += "s"; }
					var iconURL = notificationIcon;
					try {
						chrome.notifications.create(title, {type:"basic", title:title, message:message, iconUrl:iconURL}, function(notificationId) {});
					} catch(e) {
					}
				} else {
					snippetNotification();
				}
			}
		}
	}
	changeIcon(0);
}
function changeIcon(tabId) {
	if (statusIcon === "L") {
		var title = "Loading...";
		var imageData19 = loadingIcon[loadingIconIndex];
		var imageData38 = null;
		var badgeText = "";
		var repeat = 0;
		if (tabId === 0) {
			repeat = 100;
			loadingIconIndex = (loadingIconIndex+1) % 8;
		}
	} else {
		var title = chrome.i18n.getMessage("email") + ": ";
		switch (statusStatus) {
			case "Y" :
				title += "Not check yet";
				break;
			case "U" :
				title += "Unrecognized response";
				break;
			case "C" :
				title += "Not connect";
				break;
			case "T" :
				title += "Request timeout";
				break;
			case "L" :
				title += "Log out";
				break;
			case "R" :
				title += "Unread (0)";
				break;
			case "Z" :
			case "V" :
			case "I" :
				title += "Unread (" + statusCounter + ")";
				break;
		}
		var imageData19 = c19;
		var imageData38 = c38;
		if (statusIcon === "G") {
			imageData19 = g19;
			imageData38 = g38;
		} else if ((statusIcon === "B") && (cTransparent)) {
			imageData19 = t19;
			imageData38 = t38;
		}
		var badgeText = "";
		if ((preference.showToolbarNumber) && (statusCounter > 0)) {
			if (!((statusIcon === "B") && (cTransparent))) {
				badgeText = statusCounter.toString();
			}
		}
		var repeat = 0;
		if (tabId === 0) {
			if (statusIcon === "B") {
				repeat = 500;
				cTransparent = !cTransparent;
			}
		}
	}
	if (MSIisLeatestData) {
		title = MSITooltip(title);
	} else {
		if (snippet.length > 0) {
			title = snippetTooltip(title);
		}
	}
	if (tabId === 0) {
		if (chrome.extension.inIncognitoContext) {
			(function(title, imageData19, imageData38, badgeText, repeat) {
				chrome.tabs.query({windowType: "normal"}, function(tabs) {
					if (tabs) {
						for (var i=0; i < tabs.length; i++) {
							chrome.browserAction.setTitle({title:title, tabId:tabs[i].id});
							chrome.browserAction.setPopup({popup:preference.popup, tabId:tabs[i].id});
							chrome.browserAction.setBadgeText({text:badgeText, tabId:tabs[i].id});
							if (badgeBackgroundColor[3] === 0) {
								chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0], tabId:tabs[i].id});
							} else {
								chrome.browserAction.setBadgeBackgroundColor({color:badgeBackgroundColor, tabId:tabs[i].id});
							}
							if ((statusIcon !== "L") || (!preference.disabledLoadingIcon)) {
								if (imageData38 === null) {
									chrome.browserAction.setIcon({imageData:{19:imageData19}, tabId:tabs[i].id});
								} else {
									chrome.browserAction.setIcon({imageData:{19:imageData19, 38:imageData38}, tabId:tabs[i].id});
								}
							}
						}
					}
					try { window.clearTimeout(timerIcon); } catch(e) {}
					if (repeat > 0) {
						timerIcon = window.setTimeout(function() { changeIcon(0); }, repeat);
					}
				});
			})(title, imageData19, imageData38, badgeText, repeat);
		} else {
			chrome.browserAction.setTitle({title:title});
			chrome.browserAction.setPopup({popup:preference.popup});
			chrome.browserAction.setBadgeText({text:badgeText});
			if (badgeBackgroundColor[3] === 0) {
				chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0]});
			} else {
				chrome.browserAction.setBadgeBackgroundColor({color:badgeBackgroundColor});
			}
			if ((statusIcon !== "L") || (!preference.disabledLoadingIcon)) {
				if (imageData38 === null) {
					chrome.browserAction.setIcon({imageData:{19:imageData19}});
				} else {
					chrome.browserAction.setIcon({imageData:{19:imageData19, 38:imageData38}});
				}
			}
			try { window.clearTimeout(timerIcon); } catch(e) {}
			if (repeat > 0) {
				timerIcon = window.setTimeout(function() { changeIcon(0); }, repeat);
			}
		}
	} else {
		chrome.browserAction.setTitle({title:title, tabId:tabId});
		chrome.browserAction.setPopup({popup:preference.popup, tabId:tabId});
		chrome.browserAction.setBadgeText({text:badgeText, tabId:tabId});
		if (badgeBackgroundColor[3] === 0) {
			chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,0], tabId:tabId});
		} else {
			chrome.browserAction.setBadgeBackgroundColor({color:badgeBackgroundColor, tabId:tabId});
		}
		if ((statusIcon !== "L") || (!preference.disabledLoadingIcon)) {
			if (imageData38 === null) {
				chrome.browserAction.setIcon({imageData:{19:imageData19}, tabId:tabId});
			} else {
				chrome.browserAction.setIcon({imageData:{19:imageData19, 38:imageData38}, tabId:tabId});
			}
		}
	}
}


//================================================
//	Open URL or Email
//================================================
function openMail(openMode) {
	clearStatus();
	if (MSIisLeatestData) {
		MSIopenMail(openMode);
	} else {
		if (preference.reUseExistingMailTab) {
			(function (openMode) {
				chrome.tabs.query({windowType: "normal", url:matchPattern[preference.site]}, function(tabs) {
					if (tabs) {
						if (tabs.length > 0) {
							chrome.tabs.update(tabs[0].id, {active:true}, function(tab) {
								chrome.windows.update(tab.windowId, {focused:true});
								resetCounter();
							});
							return;
						}
					}
					openURL(emailURL[preference.site], openMode);
					resetCounter();
				});
			})(openMode);
		} else {
			openURL(emailURL[preference.site], openMode);
			resetCounter();
		}
	}
}
function openURL(targetURL, openMode) {
	// openMode = 0 = open in current tab
	// 			= 1 = open in new tab (or blank current tab) and active
	//			= 2 = open in new background tab
	if (openMode === 0) {
		(function (targetURL) {
			chrome.tabs.query({windowType: "normal", active:true, lastFocusedWindow:true}, function(tabs) {
				if (tabs) {
					if (tabs.length > 0) {
						chrome.tabs.update(tabs[0].id, {url:targetURL, active:true});
						return;
					}
				}
				openURL(targetURL, 1);
			});
		})(targetURL);
	} else if (openMode === 1) {
		(function (targetURL) {
			chrome.tabs.query({windowType: "normal", active:true, lastFocusedWindow:true}, function(tabs) {
				if (tabs) {
					if (tabs.length > 0) {
						if (tabs[0].url === "chrome://newtab/") {
							chrome.tabs.update(tabs[0].id, {url:targetURL, active:true});
							return;
						}
					}
				}
				chrome.tabs.create({url:targetURL, active:true});
			});
		})(targetURL);
	} else {
		chrome.tabs.create({url:targetURL, active:false});
	}
}
function resetCounter() {
	if (preference.resetCounter) {
		switch (statusIcon) {
			case "C" :
			case "B" :
				statusIcon = "C";
				statusAlert = false;
				statusStatus = "R";
				statusCounter = 0;
				MSIisLeatestData = false;
				changeStatus();
				break;
		}
	} else {
		if (statusIcon === "B") {
			statusIcon = "C";
			statusAlert = false;
			changeStatus();
		}
	}
}


//================================================
//  Check Email
//================================================
function delayFirstCheck() {
	if (preference.interval !== 0x7FFFFFFF) {
		timerDelayFirstCheck = window.setTimeout(function() {
			checkNow(false);
		}, preference.delayFirstChecking * 1000);
	}
}
function checkNow(silentCheck) {
	try { window.clearTimeOut(timerDelayFirstCheck); } catch(e) {}
	if (statusIcon !== "L") {
		try { window.clearInterval(timerInterval); } catch(e) {}
		refreshInformation(silentCheck);
		changeTimer(preference.interval);
	}
}
function changeTimer(delayInMinutes) {
	try { window.clearInterval(timerInterval); } catch(e) {}
	if (delayInMinutes !== 0x7FFFFFFF) {
		timerInterval = window.setInterval(function() { refreshInformation(false); }, delayInMinutes * 60 * 1000);
	}
}
function mailTabExist() {
	try { window.clearTimeout(timerMailTab); } catch(e) {}
	timerMailTab = window.setTimeout(function() {
		chrome.tabs.query({windowType: "normal", url:matchPattern[preference.site]}, function(tabs) {
			if (tabs) {
				if (tabs.length > 0) {
					mailTabExist();
					return;
				}
			}
			timerMailTab = window.setTimeout(function() {
				chrome.tabs.query({windowType: "normal", url:matchPattern[preference.site]}, function(tabs) {
					if (tabs) {
						if (tabs.length > 0) {
							mailTabExist();
							return;
						}
					}
					if (preference.interval !== 0x7FFFFFFF) {
						window.setTimeout(function() { checkNow(true); }, 0);
					}
				});
			}, 2000);
		});
	}, 2000);
}


//================================================
// Process
//================================================
function refreshInformation(silentCheck) {
	try { window.clearTimeout(timerTimeout); } catch(e) {}
	clearStatus();
	statusIcon = "L";
	statusAlert = false;
	changeStatus();
	forceNoAlert = silentCheck;
	MSIisLeatestData = false;
	if (preference.multipleSignIn) {
		MSIrefreshInformation();
	} else {
		sessionId ++;
		newStatus = "T";
		newCounter = 0;
		newEmailAddress = "";
		snippet = [];
		try { xhr.abort(); } catch(e) {}
		xhr = new XMLHttpRequest();
		xhr.open("GET", checkEmailURL[preference.site], true);
		xhr.responseType = "text";
		xhr.addEventListener("error", function(event) {
			infoError(Number(event.target.id));
		});
		xhr.addEventListener("load", function(event) {
			infoReceived(Number(event.target.id), event.target.responseText);
		});
		xhr.id = sessionId.toString();
		xhr.send();
		timerTimeout = window.setTimeout(function() { infoFinish(); }, timeoutForCheckMail);
	}
}
function infoError(id) {
	if (id !== sessionId) { return; }
	newStatus = "C";
	infoFinish();
}
function infoReceived(id, responseText) {
	if (id !== sessionId) { return; }
	var totalCount = analyzeHTML(responseText);
	if (isNaN(totalCount)) {
		sessionId ++;
		try { xhr.abort(); } catch(e) {}
		var redirectData = totalCount.split(" ");
		if (redirectData[0] == "GET") {
			xhr = new XMLHttpRequest();
			xhr.open("GET", redirectData[1], true);
			xhr.responseType = "text";
			xhr.addEventListener("error", function(event) {
				infoError(Number(event.target.id));
			});
			xhr.addEventListener("load", function(event) {
				infoReceived(Number(event.target.id), event.target.responseText);
			});
			xhr.id = sessionId.toString();
			xhr.send();
			return;
		} else if (redirectData[0] == "POST") {
			xhr = new XMLHttpRequest();
			xhr.open("POST", redirectData[1], true);
			xhr.responseType = "text";
			xhr.addEventListener("error", function(event) {
				infoError(Number(event.target.id));
			});
			xhr.addEventListener("load", function(event) {
				infoReceived(Number(event.target.id), event.target.responseText);
			});
			xhr.id = sessionId.toString();
			xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xhr.send(redirectData[2]);
			return;
		}
	}
	switch (totalCount) {
		case -3:
			newStatus = "C";
			break;
		case -2:
			newStatus = "L";
			break;
		case -1:
			newStatus = "U";
			break;
		default:
			newEmailAddress = findEmailAddress(responseText);
			if (preference.feedEnhance) {
				feedEnhance(totalCount);
				return;
			} else {
				if (totalCount === 0) {
					newStatus = "Z";
				} else {
					if ((emailAddress !== newEmailAddress) || (totalCount > statusCounter)) {
						newStatus = "I";
					} else {
						newStatus = "V";
					}
					newCounter = totalCount;
				}
			}
			break;
	}
	infoFinish();
}
function infoFinish() {
	try { window.clearTimeout(timerTimeout); } catch(e) {}
	sessionId ++;
	try { xhr.abort(); } catch(e) {}
	xhr = null;
	switch (newStatus) {
		case "U":
		case "C":
		case "T":
		case "L":
			statusIcon = "G"
			statusAlert = false;
			statusStatus = newStatus;
			statusCounter = 0;
			emailAddress = "";
			break;
		case "Z":
			statusIcon = "C"
			statusAlert = false;
			statusStatus = "Z";
			statusCounter = 0;
			emailAddress = newEmailAddress;
			break;
		case "V":
			if (preference.newlyArrived) {
				statusIcon = "C"
				statusAlert = false;
			} else {
				statusAlert = true;
				if (preference.blink) {
					statusIcon = "B";
				} else {
					statusIcon = "C";
				}
			}
			statusStatus = "V";
			statusCounter = newCounter;
			emailAddress = newEmailAddress;
			break;
		case "I":
			statusAlert = true;
			if (preference.blink) {
				statusIcon = "B"
			} else {
				statusIcon = "C"
			}
			statusStatus = "I";
			statusCounter = newCounter;
			emailAddress = newEmailAddress;
			break;
	}
	newStatus = null;
	newCounter = null;
	newEmailAddress = null;
	if (forceNoAlert) {
		forceNoAlert = false;
		statusAlert = false;
		if (statusIcon === "B") {
			statusIcon = "C";
		}
	}
	changeStatus();
}


//================================================
// Main
//================================================
function MainThread() {
	var version = localStorage.version;
	if (!version) {
		localStorage.clear();
		chrome.storage.local.clear();
		localStorage.version = thisVersion.toFixed(2);
		localStorage.preference = JSON.stringify(preference);
		localStorage.icon = "default.png";
		chrome.storage.local.set({soundFile:"default.wav"});
	} else {
		var preferenceVersion = Number(version);
		if (preferenceVersion < thisVersion) {
			localStorage.version = thisVersion.toFixed(2);
			//if (preferenceVersion < 1.0) {}
		}
	}
	preference = JSON.parse(localStorage.preference);
	var img = new Image();
	img.addEventListener("load", function(event) {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", 152);
		canvas.setAttribute("height", 19);
		var ctx = canvas.getContext("2d");
		ctx.clearRect (0, 0, 152, 19);
		ctx.drawImage(event.target, 0, 0, 152, 19);
		loadingIcon = [];
		for (var i = 0; i < 8; i++) {
			loadingIcon.push(ctx.getImageData(i * 19, 0, 19, 19));
		}
		ctx = null;
		canvas = null;
		var img = new Image();
		img.addEventListener("load", function(event) {
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", 195);
			canvas.setAttribute("height", 80);
			var ctx = canvas.getContext("2d");
			ctx.clearRect (0, 0, 195, 80);
			t19 = ctx.getImageData(0, 0, 19, 19);
			t38 = ctx.getImageData(0, 0, 38, 38);
			ctx.drawImage(event.target, 0, 0, 195, 80);
			c38 = ctx.getImageData(80, 0, 38, 38);
			c19 = ctx.getImageData(118, 0, 19, 19);
			g38 = ctx.getImageData(137, 0, 38, 38);
			g19 = ctx.getImageData(175, 0, 19, 19);
			var bgImgData = ctx.getImageData(194, 0, 1, 1);
			if (bgImgData.data[3] === 0) {
				badgeBackgroundColor = [0, 0, 0, 0];
			} else {
				badgeBackgroundColor = [bgImgData.data[0], bgImgData.data[1], bgImgData.data[2], 255];
			}
			var c80 = ctx.getImageData(0, 0, 80, 80);
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width", 80);
			canvas.setAttribute("height", 80);
			var ctx = canvas.getContext("2d");
			ctx.clearRect (0, 0, 80, 80);
			ctx.putImageData(c80, 0, 0);
			notificationIcon = canvas.toDataURL("image/png", "");
			ctx = null;
			canvas = null;
			chrome.storage.local.get("soundFile", function(items) {
				soundFile = items.soundFile;
				try {
					chrome.notifications.onClicked.addListener(function(notificationId) {
						openMail(1);
					});
				} catch(e) {
				}
				if (chrome.extension.inIncognitoContext) {
					chrome.tabs.onCreated.addListener(function(tab) {
						window.setTimeout(function() { changeIcon(tab.id); }, 0);
						window.setTimeout(function() { changeIcon(tab.id); }, 100);
						window.setTimeout(function() { changeIcon(tab.id); }, 500);
						window.setTimeout(function() { changeIcon(tab.id); }, 1000);
						window.setTimeout(function() { changeIcon(tab.id); }, 1500);
						window.setTimeout(function() { changeIcon(tab.id); }, 2000);
					});
					chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
						window.setTimeout(function() { changeIcon(addedTabId); }, 0);
						window.setTimeout(function() { changeIcon(addedTabId); }, 100);
						window.setTimeout(function() { changeIcon(addedTabId); }, 500);
						window.setTimeout(function() { changeIcon(addedTabId); }, 1000);
						window.setTimeout(function() { changeIcon(addedTabId); }, 1500);
						window.setTimeout(function() { changeIcon(addedTabId); }, 2000);
					});
				}
				chrome.browserAction.onClicked.addListener(function(tab) {
					var currentTime = (new Date()).getTime();
					if (firstClickTime === 0) {
						firstClickTime = currentTime;
						timerBrowerAction = window.setTimeout(function() {
							firstClickTime = 0;
							openMail(preference.openBehavior);
						}, doubleClickInterval);
					} else {
						try { window.clearTimeout(timerBrowerAction); } catch(e) {}
						var clickInterval = currentTime - firstClickTime;
						firstClickTime = 0;
						if (clickInterval > doubleClickInterval) {
							openMail(preference.openBehavior);
						} else {
							checkNow(false);
						}
					}
				});
				chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
					chrome.tabs.get(addedTabId, function(tab) {
						if (tab) {
							if ((new RegExp(matchRegExp[preference.site], "")).test(tab.url)) {
								mailTabExist();
							}
						}
					});
				});
				chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
					if (changeInfo.status === "complete") {
						if ((new RegExp(matchRegExp[preference.site], "")).test(tab.url)) {
							mailTabExist();
						}
					}
				});
				chrome.tabs.query({windowType: "normal", url:matchPattern[preference.site]}, function(tabs) {
					if (tabs) {
						if (tabs.length > 0) {
							mailTabExist();
						}
					}
					changeStatus();
					delayFirstCheck();
				});
			});
		});
		img.src = localStorage.icon;
	});
	img.src = "loading.png";
}


//================================================
// Begin here
//================================================
MainThread();
