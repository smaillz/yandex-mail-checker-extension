//================================================================
// Popup - Manifest V3 (message passing)
//================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("openMail").addEventListener("click", function() {
		chrome.runtime.sendMessage({ type: "openMail" });
		window.close();
	});
	document.getElementById("checkNow").addEventListener("click", function() {
		chrome.runtime.sendMessage({ type: "checkNow" });
		window.close();
	});
	document.getElementById("options").addEventListener("click", function() {
		chrome.runtime.openOptionsPage();
		window.close();
	});
	document.getElementById("about").addEventListener("click", function() {
		chrome.tabs.create({ url: chrome.runtime.getURL("html/about.html") });
		window.close();
	});
});

window.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
