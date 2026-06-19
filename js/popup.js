//================================================================
// Popup - Manifest V3 (message passing)
//================================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const close = () => window.close();

	document.getElementById("openMail").addEventListener("click", () => {
		chrome.runtime.sendMessage({ type: "openMail" });
		close();
	});
	document.getElementById("checkNow").addEventListener("click", () => {
		chrome.runtime.sendMessage({ type: "checkNow" });
		close();
	});
	document.getElementById("options").addEventListener("click", () => {
		chrome.runtime.openOptionsPage();
		close();
	});
});

window.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	event.stopPropagation();
	return false;
});
