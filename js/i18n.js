//================================================================
// Lightweight i18n helper: fills [data-i18n] elements from _locales
//================================================================
"use strict";

function localizePage() {
	for (const node of document.querySelectorAll("[data-i18n]")) {
		const message = chrome.i18n.getMessage(node.dataset.i18n);
		if (message) { node.textContent = message; }
	}
	for (const node of document.querySelectorAll("[data-i18n-value]")) {
		const message = chrome.i18n.getMessage(node.dataset.i18nValue);
		if (message) { node.value = message; }
	}
}

document.addEventListener("DOMContentLoaded", localizePage);
