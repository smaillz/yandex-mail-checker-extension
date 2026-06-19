//================================================================
// Lightweight i18n helper: fills [data-i18n] elements from _locales
//================================================================
"use strict";

function localizePage() {
	var nodes = document.querySelectorAll("[data-i18n]");
	for (var i = 0; i < nodes.length; i++) {
		var key = nodes[i].getAttribute("data-i18n");
		var message = chrome.i18n.getMessage(key);
		if (message) { nodes[i].textContent = message; }
	}
	var valueNodes = document.querySelectorAll("[data-i18n-value]");
	for (var j = 0; j < valueNodes.length; j++) {
		var valueKey = valueNodes[j].getAttribute("data-i18n-value");
		var valueMessage = chrome.i18n.getMessage(valueKey);
		if (valueMessage) { valueNodes[j].value = valueMessage; }
	}
}

document.addEventListener("DOMContentLoaded", localizePage);
