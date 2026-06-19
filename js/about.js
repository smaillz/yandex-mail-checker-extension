//================================================================
// About - Manifest V3
//================================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const { version } = chrome.runtime.getManifest();
	try {
		document.getElementById("name").textContent = chrome.i18n.getMessage("name");
	} catch {
		// i18n is optional here.
	}
	document.getElementById("version").textContent = chrome.i18n.getMessage("versionLabel", [version]);
});

window.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
