//================================================================
// About - Manifest V3
//================================================================
"use strict";

document.addEventListener("DOMContentLoaded", function() {
	var manifest = chrome.runtime.getManifest();
	try {
		document.getElementById("name").textContent = chrome.i18n.getMessage("name");
	} catch (e) {}
	document.getElementById("version").textContent = chrome.i18n.getMessage("versionLabel", [manifest.version]);
});

window.addEventListener("contextmenu", function(event) {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
