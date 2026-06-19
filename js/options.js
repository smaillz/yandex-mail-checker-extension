//================================================================
// Options - Manifest V3 (chrome.storage based)
//================================================================
"use strict";

var MAX_AUTO_CHECK_RANGE = 181;
var NEVER_INTERVAL = 0x7FFFFFFF;

var SITE_NAMES = ["yandex.com", "yandex.by", "yandex.kz", "yandex.ru", "yandex.com.tr", "yandex.ua"];

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

function getPreference() {
	return new Promise(function(resolve) {
		chrome.storage.local.get("preference", function(items) {
			var pref = items && items.preference ? items.preference : {};
			resolve(Object.assign({}, DEFAULT_PREFERENCE, pref));
		});
	});
}

function buildSiteList(selectedSite) {
	var container = document.getElementById("siteList");
	container.textContent = "";
	SITE_NAMES.forEach(function(name, index) {
		var row = document.createElement("div");
		row.className = "row";
		var label = document.createElement("label");
		var radio = document.createElement("input");
		radio.type = "radio";
		radio.name = "site";
		radio.id = "site" + index;
		radio.checked = (index === selectedSite);
		label.appendChild(radio);
		label.appendChild(document.createTextNode(" " + name));
		row.appendChild(label);
		container.appendChild(row);
	});
}

function updateAutoCheckText() {
	var value = Number(document.getElementById("autoCheckRange").value);
	var text;
	if (value === MAX_AUTO_CHECK_RANGE) {
		text = "Never";
	} else if (value >= 60) {
		var hours = Math.floor(value / 60);
		var minutes = value % 60;
		text = hours + (hours > 1 ? " hours" : " hour");
		if (minutes !== 0) { text += " " + minutes + (minutes > 1 ? " minutes" : " minute"); }
	} else {
		text = value + (value > 1 ? " minutes" : " minute");
	}
	document.getElementById("autoCheckText").textContent = "Check every: " + text;
}

function intervalToSlider(interval) {
	if (interval === NEVER_INTERVAL) { return MAX_AUTO_CHECK_RANGE; }
	if (interval < 1) { return 1; }
	if (interval > 180) { return 180; }
	return interval;
}

function sliderToInterval(slider) {
	if (slider === MAX_AUTO_CHECK_RANGE) { return NEVER_INTERVAL; }
	return slider;
}

function loadForm(pref) {
	buildSiteList(pref.site);
	document.getElementById("inbox").checked = pref.inbox;
	document.getElementById("autoCheckRange").value = intervalToSlider(pref.interval);
	updateAutoCheckText();
	document.getElementById("showToolbarNumber").checked = pref.showToolbarNumber;
	document.getElementById("showPopup").checked = pref.showPopup;
	document.getElementById("noPopup").checked = !pref.showPopup;
	document.getElementById("resetCounter").checked = pref.resetCounter;
	document.getElementById("reUseExistingMailTab").checked = pref.reUseExistingMailTab;
	document.getElementById("openEmailInCurrentTab").checked = (pref.openBehavior === 0);
	document.getElementById("openEmailInNewTab").checked = (pref.openBehavior === 1);
	document.getElementById("openEmailInNewBackgroundTab").checked = (pref.openBehavior === 2);
}

function readForm() {
	var pref = {};
	pref.site = 0;
	for (var i = 0; i < SITE_NAMES.length; i++) {
		var radio = document.getElementById("site" + i);
		if (radio && radio.checked) { pref.site = i; break; }
	}
	pref.inbox = document.getElementById("inbox").checked;
	pref.interval = sliderToInterval(Number(document.getElementById("autoCheckRange").value));
	pref.showToolbarNumber = document.getElementById("showToolbarNumber").checked;
	pref.showPopup = document.getElementById("showPopup").checked;
	pref.resetCounter = document.getElementById("resetCounter").checked;
	pref.reUseExistingMailTab = document.getElementById("reUseExistingMailTab").checked;
	if (document.getElementById("openEmailInCurrentTab").checked) {
		pref.openBehavior = 0;
	} else if (document.getElementById("openEmailInNewBackgroundTab").checked) {
		pref.openBehavior = 2;
	} else {
		pref.openBehavior = 1;
	}
	return pref;
}

function saveForm() {
	var pref = readForm();
	chrome.storage.local.set({ preference: pref }, function() {
		chrome.runtime.sendMessage({ type: "prefsUpdated" });
		var status = document.getElementById("status");
		status.textContent = "Saved.";
		setTimeout(function() { status.textContent = ""; }, 1500);
	});
}

document.addEventListener("DOMContentLoaded", function() {
	try {
		document.getElementById("name").textContent = chrome.i18n.getMessage("name");
	} catch (e) {}

	getPreference().then(loadForm);

	document.getElementById("autoCheckRange").addEventListener("input", updateAutoCheckText);
	document.getElementById("save").addEventListener("click", saveForm);
});
