//================================================================
// Yandex Mail checker - Manifest V3 service worker
//================================================================
"use strict";

importScripts("edition.js");


//================================================
// Constants
//================================================
var ALARM_NAME = "checkMail";
var NEVER_INTERVAL = 0x7FFFFFFF;
var REQUEST_TIMEOUT_MS = 50000;
var DOUBLE_CLICK_MS = 1000;

var DEFAULT_PREFERENCE = {
	site: 0,
	inbox: true,
	interval: 30,
	showToolbarNumber: true,
	showPopup: true,
	resetCounter: true,
	reUseExistingMailTab: true,
	openBehavior: 1
};


//================================================
// In-memory (non-persistent) state
//================================================
var grayIcons = null;
var checking = false;
var firstClickTime = 0;
var clickTimer = null;


//================================================
// Preferences (chrome.storage.local)
//================================================
function getPreference() {
	return new Promise(function(resolve) {
		chrome.storage.local.get("preference", function(items) {
			var pref = items && items.preference ? items.preference : {};
			var merged = Object.assign({}, DEFAULT_PREFERENCE, pref);
			if (!items || !items.preference) {
				chrome.storage.local.set({ preference: merged });
			}
			resolve(merged);
		});
	});
}


//================================================
// Icons
//================================================
function getGrayIcons() {
	if (grayIcons) { return Promise.resolve(grayIcons); }
	var sources = { 19: "c19.png", 38: "c38.png" };
	var sizes = [19, 38];
	return Promise.all(sizes.map(function(size) {
		return fetch(chrome.runtime.getURL(sources[size]))
			.then(function(resp) { return resp.blob(); })
			.then(function(blob) { return createImageBitmap(blob); })
			.then(function(bitmap) {
				var canvas = new OffscreenCanvas(size, size);
				var ctx = canvas.getContext("2d");
				ctx.drawImage(bitmap, 0, 0, size, size);
				var imageData = ctx.getImageData(0, 0, size, size);
				var data = imageData.data;
				for (var i = 0; i < data.length; i += 4) {
					var gray = Math.round(0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]);
					data[i] = gray;
					data[i + 1] = gray;
					data[i + 2] = gray;
				}
				return { size: size, imageData: imageData };
			});
	})).then(function(results) {
		var map = {};
		results.forEach(function(r) { map[r.size] = r.imageData; });
		grayIcons = map;
		return grayIcons;
	});
}

function setColorIcon() {
	chrome.action.setIcon({ path: { 19: "c19.png", 38: "c38.png" } });
}

function setGrayIcon() {
	getGrayIcons().then(function(icons) {
		chrome.action.setIcon({ imageData: { 19: icons[19], 38: icons[38] } });
	}).catch(function() {});
}


//================================================
// Apply status to the toolbar action
//================================================
function mailLabel() {
	try { return chrome.i18n.getMessage("email") || "Yandex Mail"; } catch (e) { return "Yandex Mail"; }
}

function setChecking() {
	chrome.action.setTitle({ title: mailLabel() + ": Checking..." });
}

function applyState(state, count, prefs) {
	var label = mailLabel();
	switch (state) {
		case "unread":
			setColorIcon();
			var badge = (prefs.showToolbarNumber && count > 0) ? String(count) : "";
			chrome.action.setBadgeText({ text: badge });
			chrome.action.setTitle({ title: label + ": Unread (" + count + ")" });
			break;
		case "empty":
			setColorIcon();
			chrome.action.setBadgeText({ text: "" });
			chrome.action.setTitle({ title: label + ": No unread email" });
			break;
		case "loggedout":
			setGrayIcon();
			chrome.action.setBadgeText({ text: "" });
			chrome.action.setTitle({ title: label + ": Logged out" });
			break;
		case "disconnected":
			setGrayIcon();
			chrome.action.setBadgeText({ text: "" });
			chrome.action.setTitle({ title: label + ": Not connected" });
			break;
		case "timeout":
			setGrayIcon();
			chrome.action.setBadgeText({ text: "" });
			chrome.action.setTitle({ title: label + ": Request timeout" });
			break;
		case "unknown":
		default:
			setGrayIcon();
			chrome.action.setBadgeText({ text: "?" });
			chrome.action.setTitle({ title: label + ": Unrecognized response" });
			break;
	}
}


//================================================
// Check email
//================================================
function fetchText(method, url, body) {
	var controller = new AbortController();
	var timer = setTimeout(function() { controller.abort("timeout"); }, REQUEST_TIMEOUT_MS);
	var options = { method: method, credentials: "include", redirect: "follow", signal: controller.signal };
	if (body != null) {
		options.body = body;
		options.headers = { "Content-type": "application/x-www-form-urlencoded" };
	}
	return fetch(url, options).then(function(resp) {
		return resp.text();
	}).finally(function() {
		clearTimeout(timer);
	});
}

function fetchUnreadCount(prefs) {
	var method = "GET";
	var url = checkEmailURL[prefs.site];
	var body = null;
	var step = 0;

	function next() {
		if (step++ > 5) { return -1; }
		return fetchText(method, url, body).then(function(text) {
			var result = analyzeHTML(text);
			if (typeof result === "number" && !isNaN(result)) {
				return result;
			}
			var parts = String(result).split(" ");
			if (parts[0] === "GET") {
				method = "GET"; url = parts[1]; body = null;
				return next();
			}
			if (parts[0] === "POST") {
				method = "POST"; url = parts[1]; body = parts.slice(2).join(" ");
				return next();
			}
			return -1;
		});
	}

	return next();
}

function checkNow() {
	if (checking) { return; }
	checking = true;
	setChecking();
	getPreference().then(function(prefs) {
		return fetchUnreadCount(prefs).then(function(count) {
			if (count === -3) {
				applyState("disconnected", 0, prefs);
			} else if (count === -2) {
				applyState("loggedout", 0, prefs);
			} else if (count === -1) {
				applyState("unknown", 0, prefs);
			} else if (count === 0) {
				applyState("empty", 0, prefs);
			} else {
				applyState("unread", count, prefs);
			}
		}).catch(function(error) {
			if (error === "timeout" || (error && error.name === "AbortError")) {
				applyState("timeout", 0, prefs);
			} else {
				applyState("disconnected", 0, prefs);
			}
		});
	}).finally(function() {
		checking = false;
	});
}


//================================================
// Open mail
//================================================
function openURL(targetURL, openMode) {
	// openMode 0 = current tab, 1 = new/active tab, 2 = new background tab
	if (openMode === 0) {
		chrome.tabs.query({ windowType: "normal", active: true, lastFocusedWindow: true }, function(tabs) {
			if (tabs && tabs.length > 0) {
				chrome.tabs.update(tabs[0].id, { url: targetURL, active: true });
			} else {
				openURL(targetURL, 1);
			}
		});
	} else if (openMode === 1) {
		chrome.tabs.query({ windowType: "normal", active: true, lastFocusedWindow: true }, function(tabs) {
			if (tabs && tabs.length > 0 && tabs[0].url === "chrome://newtab/") {
				chrome.tabs.update(tabs[0].id, { url: targetURL, active: true });
			} else {
				chrome.tabs.create({ url: targetURL, active: true });
			}
		});
	} else {
		chrome.tabs.create({ url: targetURL, active: false });
	}
}

function resetCounterOnOpen(prefs) {
	if (prefs.resetCounter) {
		chrome.action.setBadgeText({ text: "" });
		setColorIcon();
		chrome.action.setTitle({ title: mailLabel() + ": No unread email" });
	}
}

function openMail() {
	getPreference().then(function(prefs) {
		if (prefs.reUseExistingMailTab) {
			chrome.tabs.query({ windowType: "normal", url: matchPattern[prefs.site] }, function(tabs) {
				if (tabs && tabs.length > 0) {
					chrome.tabs.update(tabs[0].id, { active: true }, function(tab) {
						if (tab) { chrome.windows.update(tab.windowId, { focused: true }); }
						resetCounterOnOpen(prefs);
					});
				} else {
					openURL(emailURL[prefs.site], prefs.openBehavior);
					resetCounterOnOpen(prefs);
				}
			});
		} else {
			openURL(emailURL[prefs.site], prefs.openBehavior);
			resetCounterOnOpen(prefs);
		}
	});
}


//================================================
// Scheduling
//================================================
function rescheduleAlarm(prefs) {
	chrome.alarms.clear(ALARM_NAME, function() {
		if (prefs.interval !== NEVER_INTERVAL) {
			var minutes = Math.max(1, prefs.interval);
			chrome.alarms.create(ALARM_NAME, { periodInMinutes: minutes });
		}
	});
}

function applyPopupSetting(prefs) {
	chrome.action.setPopup({ popup: prefs.showPopup ? "popup.html" : "" });
}

function initialize() {
	getPreference().then(function(prefs) {
		applyPopupSetting(prefs);
		rescheduleAlarm(prefs);
		checkNow();
	});
}


//================================================
// Listeners
//================================================
chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name === ALARM_NAME) { checkNow(); }
});

chrome.action.onClicked.addListener(function() {
	// Only fires when no popup is set (single/double click mode).
	var now = Date.now();
	if (firstClickTime === 0) {
		firstClickTime = now;
		clickTimer = setTimeout(function() {
			firstClickTime = 0;
			openMail();
		}, DOUBLE_CLICK_MS);
	} else {
		clearTimeout(clickTimer);
		firstClickTime = 0;
		checkNow();
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message || !message.type) { return false; }
	switch (message.type) {
		case "openMail":
			openMail();
			break;
		case "checkNow":
			checkNow();
			break;
		case "prefsUpdated":
			getPreference().then(function(prefs) {
				applyPopupSetting(prefs);
				rescheduleAlarm(prefs);
				checkNow();
			});
			break;
	}
	return false;
});


// Run once when the service worker is first loaded.
initialize();
